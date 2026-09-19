package com.huquqiykeyboard;

import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.inputmethodservice.InputMethodService;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class HuquqiyKeyboardService extends InputMethodService {

    private View warningCardContainer;
    private TextView warningTitle;
    private TextView warningDescription;
    private TextView warningDocTitle;
    private TextView warningDetailsBtn;
    private View closeWarningBtn;

    private LinearLayout keyboardKeysLayout;
    private StringBuilder currentSentence = new StringBuilder();
    private Handler debounceHandler = new Handler(Looper.getMainLooper());
    private Runnable analysisRunnable;
    private boolean isPasswordSensitive = false;
    private String currentLexUrl = "https://lex.uz";

    @Override
    public View onCreateInputView() {
        View layout = getLayoutInflater().inflate(R.layout.keyboard_service_view, null);

        warningCardContainer = layout.findViewById(R.id.warningCardContainer);
        warningTitle = layout.findViewById(R.id.warningTitle);
        warningDescription = layout.findViewById(R.id.warningDescription);
        warningDocTitle = layout.findViewById(R.id.warningDocTitle);
        warningDetailsBtn = layout.findViewById(R.id.warningDetailsBtn);
        closeWarningBtn = layout.findViewById(R.id.closeWarningBtn);

        keyboardKeysLayout = layout.findViewById(R.id.keyboardKeysLayout);

        closeWarningBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                warningCardContainer.setVisibility(View.GONE);
            }
        });

        warningDetailsBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentLexUrl != null) {
                    Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(currentLexUrl));
                    browserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(browserIntent);
                }
            }
        });

        buildKeyboardKeys();

        return layout;
    }

    @Override
    public void onStartInputView(EditorInfo info, boolean restarting) {
        super.onStartInputView(info, restarting);
        currentSentence.setLength(0);
        
        // Privacy protection: check for password/sensitive fields
        int variation = info.inputType & InputType.TYPE_MASK_VARIATION;
        int inputClass = info.inputType & InputType.TYPE_MASK_CLASS;

        isPasswordSensitive = (variation == InputType.TYPE_TEXT_VARIATION_PASSWORD) ||
                (variation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) ||
                (variation == InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD) ||
                (variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD) ||
                (inputClass == InputType.TYPE_CLASS_NUMBER && variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD);

        if (isPasswordSensitive) {
            warningCardContainer.setVisibility(View.GONE);
        }
    }

    private void buildKeyboardKeys() {
        keyboardKeysLayout.removeAllViews();

        String[] row1 = {"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"};
        String[] row2 = {"a", "s", "d", "f", "g", "h", "j", "k", "l"};
        String[] row3 = {"⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"};
        String[] row4 = {"?123", "🌐", "O‘zbekcha", ".", "↵"};

        keyboardKeysLayout.addView(createKeyRow(row1));
        keyboardKeysLayout.addView(createKeyRow(row2));
        keyboardKeysLayout.addView(createKeyRow(row3));
        keyboardKeysLayout.addView(createKeyRow(row4));
    }

    private LinearLayout createKeyRow(String[] keys) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        row.setPadding(0, 4, 0, 4);

        for (final String keyLabel : keys) {
            Button btn = new Button(this);
            btn.setText(keyLabel);
            btn.setTextColor(0xFFFFFFFF);
            btn.setTextSize(16);
            btn.setPadding(0, 0, 0, 0);

            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    0,
                    120,
                    keyLabel.equals("O‘zbekcha") ? 4f : (keyLabel.equals("↵") ? 1.4f : 1f)
            );
            params.setMargins(3, 3, 3, 3);
            btn.setLayoutParams(params);

            if (keyLabel.equals("↵")) {
                btn.setBackgroundColor(0xFF1976F3);
            } else if (keyLabel.equals("⇧") || keyLabel.equals("⌫") || keyLabel.equals("?123") || keyLabel.equals("🌐")) {
                btn.setBackgroundColor(0xFF162C46);
                btn.setTextColor(0xFF94A3B8);
            } else {
                btn.setBackgroundColor(0xFF1E3653);
            }

            btn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    handleKeyPress(keyLabel);
                }
            });

            row.addView(btn);
        }

        return row;
    }

    private void handleKeyPress(String keyLabel) {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;

        if (keyLabel.equals("⌫")) {
            ic.deleteSurroundingText(1, 0);
            if (currentSentence.length() > 0) {
                currentSentence.deleteCharAt(currentSentence.length() - 1);
            }
        } else if (keyLabel.equals("↵")) {
            ic.commitText("\n", 1);
            currentSentence.setLength(0);
        } else if (keyLabel.equals("O‘zbekcha")) {
            ic.commitText(" ", 1);
            currentSentence.append(" ");
        } else if (!keyLabel.equals("⇧") && !keyLabel.equals("?123") && !keyLabel.equals("🌐")) {
            ic.commitText(keyLabel, 1);
            currentSentence.append(keyLabel);
        }

        if (!isPasswordSensitive) {
            triggerDebouncedLegalAnalysis();
        }
    }

    private void triggerDebouncedLegalAnalysis() {
        if (debounceHandler != null && analysisRunnable != null) {
            debounceHandler.removeCallbacks(analysisRunnable);
        }

        analysisRunnable = new Runnable() {
            @Override
            public void run() {
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
