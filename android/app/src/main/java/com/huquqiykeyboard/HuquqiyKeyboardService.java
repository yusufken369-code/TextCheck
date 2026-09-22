package com.huquqiykeyboard;

import com.huquqiykeyboard.R;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;
import android.inputmethodservice.InputMethodService;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class HuquqiyKeyboardService extends InputMethodService {

    private View warningCardContainer;
    private TextView warningTitle;
    private TextView warningDescription;
    private TextView warningDocTitle;
    private View closeWarningBtn;

    private TextView langUz;
    private TextView langRu;
    private TextView langEng;
    private TextView toggleLegalCheck;
    private View hideKeyboardBtn;

    private LinearLayout keyboardKeysLayout;
    private StringBuilder currentSentence = new StringBuilder();
    private Handler debounceHandler = new Handler(Looper.getMainLooper());
    private Runnable analysisRunnable;
    private boolean isPasswordSensitive = false;
    private String currentLexUrl = "https://lex.uz";

    // Keyboard state
    private String currentLanguage = "oz_cyr"; // "oz_cyr", "ru_cyr", "eng"
    private boolean isLegalCheckEnabled = true;
    private boolean isShifted = false;
    private boolean isSymbols = false;

    @Override
    public View onCreateInputView() {
        View layout = getLayoutInflater().inflate(R.layout.keyboard_service_view, null);

        warningCardContainer = layout.findViewById(R.id.warningCardContainer);
        warningTitle = layout.findViewById(R.id.warningTitle);
        warningDescription = layout.findViewById(R.id.warningDescription);
        warningDocTitle = layout.findViewById(R.id.warningDocTitle);
        closeWarningBtn = layout.findViewById(R.id.closeWarningBtn);

        langUz = layout.findViewById(R.id.langUz);
        langRu = layout.findViewById(R.id.langRu);
        langEng = layout.findViewById(R.id.langEng);
        toggleLegalCheck = layout.findViewById(R.id.toggleLegalCheck);
        hideKeyboardBtn = layout.findViewById(R.id.hideKeyboardBtn);

        keyboardKeysLayout = layout.findViewById(R.id.keyboardKeysLayout);

        closeWarningBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                warningCardContainer.setVisibility(View.GONE);
            }
        });

        setupToolbarListeners();
        updateToolbarState();
        buildKeyboardKeys();

        return layout;
    }

    private void setupToolbarListeners() {
        langUz.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentLanguage = "oz_cyr";
                isSymbols = false;
                updateToolbarState();
                buildKeyboardKeys();
            }
        });

        langRu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentLanguage = "ru_cyr";
                isSymbols = false;
                updateToolbarState();
                buildKeyboardKeys();
            }
        });

        langEng.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentLanguage = "eng";
                isSymbols = false;
                updateToolbarState();
                buildKeyboardKeys();
            }
        });

        toggleLegalCheck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isLegalCheckEnabled = !isLegalCheckEnabled;
                updateLegalCheckToggleUI();
                if (!isLegalCheckEnabled) {
                    warningCardContainer.setVisibility(View.GONE);
                } else {
                    triggerDebouncedLegalAnalysis();
                }
            }
        });

        hideKeyboardBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                requestHideSelf(0);
            }
        });
    }

    private void updateToolbarState() {
        // Reset all tabs styling
        langUz.setText("Ўз");
        langUz.setTextColor(0xFF94A3B8);
        langUz.setBackgroundColor(0x00000000);

        langRu.setText("Рус");
        langRu.setTextColor(0xFF94A3B8);
        langRu.setBackgroundColor(0x00000000);

        langEng.setText("Eng");
        langEng.setTextColor(0xFF94A3B8);
        langEng.setBackgroundColor(0x00000000);

        // Highlight selected tab
        if ("oz_cyr".equals(currentLanguage) || "oz_lat".equals(currentLanguage)) {
            langUz.setText("● Ўз");
            langUz.setTextColor(0xFFFFFFFF);
            langUz.setBackgroundColor(0xFF1E3653);
        } else if ("ru_cyr".equals(currentLanguage)) {
            langRu.setText("● Рус");
            langRu.setTextColor(0xFFFFFFFF);
            langRu.setBackgroundColor(0xFF1E3653);
        } else if ("eng".equals(currentLanguage)) {
            langEng.setText("● Eng");
            langEng.setTextColor(0xFFFFFFFF);
            langEng.setBackgroundColor(0xFF1E3653);
        }

        updateLegalCheckToggleUI();
    }

    private void updateLegalCheckToggleUI() {
        if (isLegalCheckEnabled) {
            toggleLegalCheck.setText("🛡️ Yoqilgan");
            toggleLegalCheck.setTextColor(0xFF10B981);
            toggleLegalCheck.setBackgroundColor(0xFF064E3B);
        } else {
            toggleLegalCheck.setText("🛡️ O‘chirilgan");
            toggleLegalCheck.setTextColor(0xFFEF4444);
            toggleLegalCheck.setBackgroundColor(0xFF7F1D1D);
        }
    }

    @Override
    public void onStartInputView(EditorInfo info, boolean restarting) {
        super.onStartInputView(info, restarting);
        currentSentence.setLength(0);
        
        int variation = info.inputType & InputType.TYPE_MASK_VARIATION;
        int inputClass = info.inputType & InputType.TYPE_MASK_CLASS;

        isPasswordSensitive = (variation == InputType.TYPE_TEXT_VARIATION_PASSWORD) ||
                (variation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) ||
                (variation == InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD) ||
                (variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD) ||
                (inputClass == InputType.TYPE_CLASS_NUMBER && variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD);

        if (isPasswordSensitive || !isLegalCheckEnabled) {
            warningCardContainer.setVisibility(View.GONE);
        }
    }

    private String getSpacebarLabel() {
        if ("oz_lat".equals(currentLanguage)) return "O‘ZBEKCHA";
        if ("oz_cyr".equals(currentLanguage)) return "ЎЗБЕКЧА";
        if ("ru_cyr".equals(currentLanguage)) return "РУССКИЙ";
        return "ENGLISH";
    }

    private void buildKeyboardKeys() {
        keyboardKeysLayout.removeAllViews();

        if (isSymbols) {
            String[] row1 = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"};
            String[] row2 = {"@", "#", "$", "%", "&", "-", "+", "(", ")", "/"};
            String[] row3 = {"*", "\"", "'", ":", ";", "!", "?", "⌫"};
            String[] row4 = {"ABC", "🌐", getSpacebarLabel(), ".", "↵"};

            keyboardKeysLayout.addView(createKeyRow(row1));
            keyboardKeysLayout.addView(createKeyRow(row2));
            keyboardKeysLayout.addView(createKeyRow(row3));
            keyboardKeysLayout.addView(createKeyRow(row4));
            return;
        }

        String[] row1;
        String[] row2;
        String[] row3;
        String[] row4 = {"?123", "🌐", getSpacebarLabel(), ".", "↵"};

        if ("oz_lat".equals(currentLanguage) || "eng".equals(currentLanguage)) {
            row1 = new String[]{"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"};
            row2 = new String[]{"a", "s", "d", "f", "g", "h", "j", "k", "l"};
            row3 = new String[]{"⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"};
        } else if ("oz_cyr".equals(currentLanguage)) {
            row1 = new String[]{"й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ў"};
            row2 = new String[]{"ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "қ"};
            row3 = new String[]{"⇧", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ғ", "ҳ", "⌫"};
        } else { // "ru_cyr"
            row1 = new String[]{"й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"};
            row2 = new String[]{"ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"};
            row3 = new String[]{"⇧", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "⌫"};
        }

        if (isShifted) {
            row1 = applyUppercase(row1);
            row2 = applyUppercase(row2);
            row3 = applyUppercase(row3);
        }

        keyboardKeysLayout.addView(createKeyRow(row1));
        keyboardKeysLayout.addView(createKeyRow(row2));
        keyboardKeysLayout.addView(createKeyRow(row3));
        keyboardKeysLayout.addView(createKeyRow(row4));
    }

    private String[] applyUppercase(String[] keys) {
        String[] upper = new String[keys.length];
        for (int i = 0; i < keys.length; i++) {
            if ("⇧".equals(keys[i]) || "⌫".equals(keys[i])) {
                upper[i] = keys[i];
            } else {
                upper[i] = keys[i].toUpperCase();
            }
        }
        return upper;
    }

    private LinearLayout createKeyRow(String[] keys) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        row.setPadding(0, 3, 0, 3);

        for (final String keyLabel : keys) {
            final Button btn = new Button(this);
            btn.setText(keyLabel);
            btn.setTextColor(0xFFFFFFFF);
            btn.setTextSize(keys.length > 10 ? 14 : 16);
            btn.setPadding(0, 0, 0, 0);

            boolean isSpace = keyLabel.equals(getSpacebarLabel());
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    0,
                    120,
                    isSpace ? 4f : (keyLabel.equals("↵") ? 1.4f : 1f)
            );
            params.setMargins(2, 2, 2, 2);
            btn.setLayoutParams(params);

            if (keyLabel.equals("↵")) {
                btn.setBackgroundColor(0xFF1976F3);
            } else if (keyLabel.equals("⇧") || keyLabel.equals("⌫") || keyLabel.equals("?123") || keyLabel.equals("ABC") || keyLabel.equals("🌐")) {
                btn.setBackgroundColor(0xFF162C46);
                btn.setTextColor(0xFF94A3B8);
                if (keyLabel.equals("⇧") && isShifted) {
                    btn.setBackgroundColor(0xFF2563EB);
                    btn.setTextColor(0xFFFFFFFF);
                }
            } else {
                btn.setBackgroundColor(0xFF1E3653);
            }

            if (keyLabel.equals("⌫")) {
                // Point 3 requirement: Hold-to-delete continuous backspace (System keyboard behavior)
                btn.setOnTouchListener(new View.OnTouchListener() {
                    private Handler repeatHandler = new Handler(Looper.getMainLooper());
                    private Runnable repeatRunnable;

                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
                        switch (event.getAction()) {
                            case MotionEvent.ACTION_DOWN:
                                v.setPressed(true);
                                handleKeyPress("⌫");

                                if (repeatRunnable != null) {
                                    repeatHandler.removeCallbacks(repeatRunnable);
                                }
                                repeatRunnable = new Runnable() {
                                    @Override
                                    public void run() {
                                        handleKeyPress("⌫");
                                        repeatHandler.postDelayed(this, 40);
                                    }
                                };
                                repeatHandler.postDelayed(repeatRunnable, 350);
                                return true;

                            case MotionEvent.ACTION_UP:
                            case MotionEvent.ACTION_CANCEL:
                                v.setPressed(false);
                                if (repeatRunnable != null) {
                                    repeatHandler.removeCallbacks(repeatRunnable);
                                }
                                return true;
                        }
                        return false;
                    }
                });
            } else {
                btn.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        handleKeyPress(keyLabel);
                    }
                });
            }

            row.addView(btn);
        }

        return row;
    }

    private void handleKeyPress(String keyLabel) {
        InputConnection ic = getCurrentInputConnection();

        if (keyLabel.equals("⌫")) {
            if (ic != null) {
                ic.deleteSurroundingText(1, 0);
            }
            if (currentSentence.length() > 0) {
                currentSentence.deleteCharAt(currentSentence.length() - 1);
            }
        } else if (keyLabel.equals("↵")) {
            if (ic != null) {
                ic.commitText("\n", 1);
            }
            currentSentence.setLength(0);
        } else if (keyLabel.equals(getSpacebarLabel())) {
            if (ic != null) {
                ic.commitText(" ", 1);
            }
            currentSentence.append(" ");
        } else if (keyLabel.equals("⇧")) {
            isShifted = !isShifted;
            buildKeyboardKeys();
            return;
        } else if (keyLabel.equals("?123")) {
            isSymbols = true;
            buildKeyboardKeys();
            return;
        } else if (keyLabel.equals("ABC")) {
            isSymbols = false;
            buildKeyboardKeys();
            return;
        } else if (keyLabel.equals("🌐")) {
            // Cycle language & show system input method picker
            cycleLanguage();
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.showInputMethodPicker();
            }
            return;
        } else {
            if (ic != null) {
                ic.commitText(keyLabel, 1);
            }
            currentSentence.append(keyLabel);
            if (isShifted) {
                isShifted = false;
                buildKeyboardKeys();
            }
        }

        if (isLegalCheckEnabled && !isPasswordSensitive) {
            triggerDebouncedLegalAnalysis();
        }
    }

    private void cycleLanguage() {
        if ("oz_cyr".equals(currentLanguage) || "oz_lat".equals(currentLanguage)) {
            currentLanguage = "ru_cyr";
        } else if ("ru_cyr".equals(currentLanguage)) {
            currentLanguage = "eng";
        } else {
            currentLanguage = "oz_cyr";
        }
        updateToolbarState();
        buildKeyboardKeys();
    }

    private void triggerDebouncedLegalAnalysis() {
        if (debounceHandler != null && analysisRunnable != null) {
            debounceHandler.removeCallbacks(analysisRunnable);
        }

        analysisRunnable = new Runnable() {
            @Override
            public void run() {
                if (!isLegalCheckEnabled || isPasswordSensitive) {
                    warningCardContainer.setVisibility(View.GONE);
                    return;
                }
                LegalAnalysisEngine.LegalMatchResult result = LegalAnalysisEngine.analyzeText(currentSentence.toString());
                if (result.hasMatch) {
                    warningTitle.setText(result.warningTitle);
                    warningDescription.setText(result.warningText);
                    warningDocTitle.setText(result.documentTitle);
                    currentLexUrl = result.lexUrl;
                    warningCardContainer.setVisibility(View.VISIBLE);
                } else {
                    warningCardContainer.setVisibility(View.GONE);
                }
            }
        };

        debounceHandler.postDelayed(analysisRunnable, 450);
    }
}
