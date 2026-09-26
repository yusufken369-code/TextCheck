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
    private TextView warningPenalty;
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
    private String currentLanguage = "oz_cyr"; // "oz_cyr", "oz_lat", "ru_cyr", "eng"
    private boolean isLegalCheckEnabled = true;
    private int shiftState = 0; // 0 = OFF (lowercase), 1 = SHIFT_ONCE (1 capital letter), 2 = CAPS_LOCK (all capital letters)
    private long lastShiftClickTime = 0;
    private boolean isSymbols = false;

    @Override
    public View onCreateInputView() {
        View layout = getLayoutInflater().inflate(R.layout.keyboard_service_view, null);

        warningCardContainer = layout.findViewById(R.id.warningCardContainer);
        warningTitle = layout.findViewById(R.id.warningTitle);
        warningDescription = layout.findViewById(R.id.warningDescription);
        warningDocTitle = layout.findViewById(R.id.warningDocTitle);
        warningPenalty = layout.findViewById(R.id.warningPenalty);
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
                hideWarningWithAnimation();
            }
        });

        warningDocTitle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentLexUrl != null && !currentLexUrl.isEmpty()) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(currentLexUrl));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
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
                if ("oz_cyr".equals(currentLanguage)) {
                    currentLanguage = "oz_lat";
                } else {
                    currentLanguage = "oz_cyr";
                }
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
        if ("oz_cyr".equals(currentLanguage)) {
            langUz.setText("● Ўз");
            langUz.setTextColor(0xFFFFFFFF);
            langUz.setBackgroundColor(0xFF1E3653);
        } else if ("oz_lat".equals(currentLanguage)) {
            langUz.setText("● O‘z");
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
        // Start keyboard in lowercase mode by default so keys show lowercase letters (q, w, e, r, t...)
        shiftState = 0;

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

        buildKeyboardKeys();
    }

    private String getSpacebarLabel() {
        if ("oz_lat".equals(currentLanguage)) return "O‘ZBEKCHA";
        if ("oz_cyr".equals(currentLanguage)) return "ЎЗБЕКЧА";
        if ("ru_cyr".equals(currentLanguage)) return "РУССКИЙ";
        return "ENGLISH";
    }

    private boolean isShiftKey(String key) {
        return "⇧".equals(key) || "⇪".equals(key) || "⇫".equals(key) || "⬆".equals(key);
    }

    private boolean isSpecialKey(String key) {
        return isShiftKey(key) || "⌫".equals(key) || "?123".equals(key) || "ABC".equals(key) || "🌐".equals(key) || "↵".equals(key) || key.equals(getSpacebarLabel());
    }

    private void buildKeyboardKeys() {
        if (keyboardKeysLayout == null) return;
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
            keyboardKeysLayout.requestLayout();
            keyboardKeysLayout.invalidate();
            return;
        }

        String[] row1;
        String[] row2;
        String[] row3;
        String[] row4 = {"?123", "🌐", getSpacebarLabel(), ".", "↵"};

        String shiftSymbol;
        if (shiftState == 0) {
            shiftSymbol = "⇧";
        } else if (shiftState == 1) {
            shiftSymbol = "⬆";
        } else {
            shiftSymbol = "⇪";
        }

        if ("oz_lat".equals(currentLanguage)) {
            row1 = new String[]{"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"};
            row2 = new String[]{"a", "s", "d", "f", "g", "h", "j", "k", "l", "o‘"};
            row3 = new String[]{shiftSymbol, "z", "x", "c", "v", "b", "n", "m", "g‘", "⌫"};
        } else if ("eng".equals(currentLanguage)) {
            row1 = new String[]{"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"};
            row2 = new String[]{"a", "s", "d", "f", "g", "h", "j", "k", "l"};
            row3 = new String[]{shiftSymbol, "z", "x", "c", "v", "b", "n", "m", "⌫"};
        } else if ("oz_cyr".equals(currentLanguage)) {
            row1 = new String[]{"й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ў"};
            row2 = new String[]{"ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "қ"};
            row3 = new String[]{shiftSymbol, "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ғ", "ҳ", "⌫"};
        } else { // "ru_cyr"
            row1 = new String[]{"й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"};
            row2 = new String[]{"ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"};
            row3 = new String[]{shiftSymbol, "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "⌫"};
        }

        if (shiftState != 0) {
            row1 = applyUppercase(row1);
            row2 = applyUppercase(row2);
            row3 = applyUppercase(row3);
        }

        keyboardKeysLayout.addView(createKeyRow(row1));
        keyboardKeysLayout.addView(createKeyRow(row2));
        keyboardKeysLayout.addView(createKeyRow(row3));
        keyboardKeysLayout.addView(createKeyRow(row4));
        keyboardKeysLayout.requestLayout();
        keyboardKeysLayout.invalidate();
    }

    private String[] applyUppercase(String[] keys) {
        String[] upper = new String[keys.length];
        for (int i = 0; i < keys.length; i++) {
            if (isSpecialKey(keys[i])) {
                upper[i] = keys[i];
            } else {
                upper[i] = keys[i].toUpperCase(java.util.Locale.ROOT);
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

            int baseSize = keys.length > 10 ? 15 : 17;
            if (shiftState != 0 && !isSpecialKey(keyLabel)) {
                btn.setTypeface(null, android.graphics.Typeface.BOLD);
            } else {
                btn.setTypeface(null, android.graphics.Typeface.NORMAL);
            }
            btn.setTextSize(baseSize);
            btn.setPadding(0, 0, 0, 0);

            boolean isSpace = keyLabel.equals(getSpacebarLabel());
            boolean isShift = isShiftKey(keyLabel);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    0,
                    120,
                    isSpace ? 4f : (keyLabel.equals("↵") ? 1.4f : 1f)
            );
            params.setMargins(2, 2, 2, 2);
            btn.setLayoutParams(params);

            if (keyLabel.equals("↵")) {
                btn.setBackgroundColor(0xFF1976F3);
            } else if (isShift || keyLabel.equals("⌫") || keyLabel.equals("?123") || keyLabel.equals("ABC") || keyLabel.equals("🌐")) {
                btn.setBackgroundColor(0xFF162C46);
                btn.setTextColor(0xFF94A3B8);
                if (isShift) {
                    if (shiftState == 1) {
                        btn.setBackgroundColor(0xFF2563EB); // Active Blue for Shift Once
                        btn.setTextColor(0xFFFFFFFF);
                    } else if (shiftState == 2) {
                        btn.setBackgroundColor(0xFF1D4ED8); // Active Darker Blue for Caps Lock
                        btn.setTextColor(0xFF67E8F9); // Highlighted Cyan icon for Caps Lock
                    }
                }
            } else {
                btn.setBackgroundColor(0xFF1E3653);
            }

            if (keyLabel.equals("⌫")) {
                // Hold-to-delete continuous backspace
                btn.setOnTouchListener(new View.OnTouchListener() {
                    private Handler repeatHandler = new Handler(Looper.getMainLooper());
                    private Runnable repeatRunnable;

                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
                        switch (event.getAction()) {
                            case MotionEvent.ACTION_DOWN:
                                v.animate().scaleX(0.92f).scaleY(0.92f).setDuration(40).start();
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
                                v.animate().scaleX(1.0f).scaleY(1.0f).setDuration(60).start();
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
                btn.setOnTouchListener(new View.OnTouchListener() {
                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
                        switch (event.getAction()) {
                            case MotionEvent.ACTION_DOWN:
                                v.animate().scaleX(0.92f).scaleY(0.92f).setDuration(40).start();
                                break;
                            case MotionEvent.ACTION_UP:
                            case MotionEvent.ACTION_CANCEL:
                                v.animate().scaleX(1.0f).scaleY(1.0f).setDuration(60).start();
                                break;
                        }
                        return false;
                    }
                });

                if (keyLabel.equals("🌐")) {
                    btn.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            handleKeyPress(keyLabel);
                        }
                    });
                    btn.setOnLongClickListener(new View.OnLongClickListener() {
                        @Override
                        public boolean onLongClick(View v) {
                            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                            if (imm != null) {
                                imm.showInputMethodPicker();
                            }
                            return true;
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
            }

            row.addView(btn);
        }

        return row;
    }

    private void toggleShift() {
        long currentTime = System.currentTimeMillis();
        long timeSinceLastClick = currentTime - lastShiftClickTime;

        if (shiftState == 2) {
            // If currently in CAPS LOCK mode, tapping Shift turns it OFF (lowercase)
            shiftState = 0;
        } else if (timeSinceLastClick < 500 && timeSinceLastClick > 0) {
            // Double tap detected! Activate CAPS LOCK mode (permanently uppercase)
            shiftState = 2;
        } else {
            // Single tap logic
            if (shiftState == 0) {
                shiftState = 1; // Lowercase -> Shift once
            } else if (shiftState == 1) {
                shiftState = 0; // Shift once -> Lowercase
            }
        }

        lastShiftClickTime = currentTime;
        buildKeyboardKeys();
    }

    private void handleKeyPress(String keyLabel) {
        InputConnection ic = getCurrentInputConnection();

        if (!isShiftKey(keyLabel)) {
            // Reset shift double-tap timer when typing non-shift keys
            lastShiftClickTime = 0;
        }

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
            if (shiftState == 0) {
                shiftState = 1;
                buildKeyboardKeys();
            }
        } else if (keyLabel.equals(getSpacebarLabel())) {
            if (ic != null) {
                ic.commitText(" ", 1);
            }
            currentSentence.append(" ");

            // Auto-capitalization after sentence end (. ! ?)
            String str = currentSentence.toString().trim();
            if (str.endsWith(".") || str.endsWith("!") || str.endsWith("?")) {
                if (shiftState == 0) {
                    shiftState = 1;
                    buildKeyboardKeys();
                }
            }
        } else if (isShiftKey(keyLabel)) {
            toggleShift();
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
            cycleLanguage();
            return;
        } else {
            if (ic != null) {
                ic.commitText(keyLabel, 1);
            }
            currentSentence.append(keyLabel);

            // Revert shift back to lowercase ONLY if shiftState == 1 (SHIFT ONCE)
            // If shiftState == 2 (CAPS LOCK), letters STAY UPPERCASE!
            if (shiftState == 1) {
                shiftState = 0;
                buildKeyboardKeys();
            }
        }

        if (isLegalCheckEnabled && !isPasswordSensitive) {
            triggerDebouncedLegalAnalysis();
        }
    }

    private void cycleLanguage() {
        if ("oz_cyr".equals(currentLanguage)) {
            currentLanguage = "oz_lat";
        } else if ("oz_lat".equals(currentLanguage)) {
            currentLanguage = "ru_cyr";
        } else if ("ru_cyr".equals(currentLanguage)) {
            currentLanguage = "eng";
        } else {
            currentLanguage = "oz_cyr";
        }
        updateToolbarState();
        buildKeyboardKeys();
    }

    private void showWarningWithAnimation() {
        if (warningCardContainer == null) return;
        if (warningCardContainer.getVisibility() != View.VISIBLE) {
            warningCardContainer.setVisibility(View.VISIBLE);
            android.view.animation.Animation fadeIn = new android.view.animation.AlphaAnimation(0.0f, 1.0f);
            fadeIn.setDuration(250);
            warningCardContainer.startAnimation(fadeIn);
        }
    }

    private void hideWarningWithAnimation() {
        if (warningCardContainer == null) return;
        if (warningCardContainer.getVisibility() == View.VISIBLE) {
            android.view.animation.Animation fadeOut = new android.view.animation.AlphaAnimation(1.0f, 0.0f);
            fadeOut.setDuration(200);
            fadeOut.setAnimationListener(new android.view.animation.Animation.AnimationListener() {
                @Override
                public void onAnimationStart(android.view.animation.Animation animation) {}
                @Override
                public void onAnimationEnd(android.view.animation.Animation animation) {
                    warningCardContainer.setVisibility(View.GONE);
                }
                @Override
                public void onAnimationRepeat(android.view.animation.Animation animation) {}
            });
            warningCardContainer.startAnimation(fadeOut);
        }
    }

    private void triggerDebouncedLegalAnalysis() {
        if (debounceHandler != null && analysisRunnable != null) {
            debounceHandler.removeCallbacks(analysisRunnable);
        }

        analysisRunnable = new Runnable() {
            @Override
            public void run() {
                if (!isLegalCheckEnabled || isPasswordSensitive) {
                    hideWarningWithAnimation();
                    return;
                }
                LegalAnalysisEngine.LegalMatchResult result = LegalAnalysisEngine.analyzeText(currentSentence.toString());
                if (result.hasMatch) {
                    if (warningTitle != null) warningTitle.setText(result.warningTitle);
                    if (warningDescription != null) warningDescription.setText(result.warningText);
                    if (warningDocTitle != null) {
                        String docStr = result.documentTitle;
                        if (result.articleNumber != null && !result.articleNumber.isEmpty()) {
                            docStr += " (" + result.articleNumber + ")";
                        }
                        warningDocTitle.setText(docStr);
                    }
                    if (warningPenalty != null && result.penaltyText != null) {
                        warningPenalty.setText("⚠️ " + result.penaltyText);
                    }
                    currentLexUrl = result.lexUrl;
                    showWarningWithAnimation();
                } else {
                    hideWarningWithAnimation();
                }
            }
        };

        debounceHandler.postDelayed(analysisRunnable, 450);
    }
}
