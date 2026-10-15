/**
 * Script to import HuquqCheck_warning_rules_10_laws.json into Supabase warning_rules table
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fteokxybopifwgmvpcan.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_X3y-ad-fYmrMDX_EVlaWdA_zgibdD5r';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function importRules() {
  console.log('Reading JSON rules file...');
  const jsonPath = path.join(__dirname, '..', 'HuquqCheck_warning_rules_10_laws.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('JSON file not found at:', jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const json = JSON.parse(raw);

  if (!json.rules || !Array.isArray(json.rules)) {
    console.error('Invalid JSON structure. "rules" array missing.');
    process.exit(1);
  }

  console.log(`Found ${json.rules.length} warning rules in JSON file.`);

  const recordsToInsert = json.rules.map(rule => ({
    id: rule.id,
    category: rule.category,
    severity: rule.severity || 'medium',
    trigger_patterns: rule.trigger_patterns || [],
    warning_uz: rule.warning ? rule.warning.uz : '',
    warning_ru: rule.warning ? rule.warning.ru : '',
    warning_en: rule.warning ? rule.warning.en : '',
    related_laws: rule.related_laws || [],
    enabled: true,
    updated_at: new Date().toISOString()
  }));

  console.log('Inserting/upserting rules into Supabase "warning_rules" table...');
  const { data, error } = await supabase
    .from('warning_rules')
    .upsert(recordsToInsert, { onConflict: 'id' });

  if (error) {
    console.error('Error importing warning rules to Supabase:', error.message);
    console.log('You can also execute the SQL migration script: supabase_warning_rules_migration.sql');
  } else {
    console.log('Successfully imported warning rules to Supabase!');
  }
}

importRules();
