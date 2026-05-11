#!/bin/bash

# ============================================================
#  Gluestack UI v3 — Manual install into existing Obytes project
#  Skips `init` (which clones a repo) — does everything manually
#  Run from your project root: bash add-gluestack.sh
# ============================================================

set -e

echo ""
echo "🎨 Installing Gluestack UI v3 (manual, no cloning)..."
echo "============================================================"

# ── STEP 1: Install npm packages ────────────────────────────
echo ""
echo "📦 Step 1/4 — Installing packages..."
pnpm add @gluestack-ui/nativewind-utils lucide-react-native react-native-svg

# ── STEP 2: Create gluestack-ui.config.json ─────────────────
# This tells the CLI where your files live so `add` works correctly
echo ""
echo "⚙️  Step 2/4 — Creating gluestack-ui.config.json..."

cat > gluestack-ui.config.json << 'EOF'
{
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/global.css"
  },
  "app": {
    "entry": "src/app/_layout.tsx",
    "components": "src/components/ui"
  }
}
EOF

echo "    ✅ gluestack-ui.config.json created"

# ── STEP 3: Add all components ──────────────────────────────
echo ""
echo "🧩 Step 3/4 — Adding all Gluestack components..."
echo "    (this may take a minute)"
echo ""

npx gluestack-ui@latest add --all --use-pnpm

# ── STEP 4: Patch tailwind.config.js ────────────────────────
echo ""
echo "🎨 Step 4/4 — Checking tailwind.config.js content paths..."

if grep -q "gluestack-ui" tailwind.config.js 2>/dev/null; then
  echo "    ✅ Gluestack paths already present in tailwind.config.js"
else
  echo ""
  echo "    ⚠️  Manually add these two lines to the 'content' array in tailwind.config.js:"
  echo ""
  echo '       "./src/components/ui/**/*.{js,jsx,ts,tsx}",'
  echo '       "./node_modules/@gluestack-ui/**/*.{js,jsx,ts,tsx}",'
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "✅ Gluestack UI v3 installed!"
echo "============================================================"
echo ""
echo "📁 Components →  ./src/components/ui/"
echo ""
echo "🔌 Wrap your app/_layout.tsx with the provider:"
echo ""
echo '   import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"'
echo ""
echo '   <GluestackUIProvider mode="light">'
echo '     {children}'
echo '   </GluestackUIProvider>'
echo ""
echo "💡 Usage example:"
echo '   import { Button, ButtonText } from "@/components/ui/button"'
echo '   <Button><ButtonText>Click me</ButtonText></Button>'
echo ""
echo "📚 Docs: https://gluestack.io/ui/docs"
echo ""