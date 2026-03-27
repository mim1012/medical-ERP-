Create a full Korean internal Medical ERP design system and UI.

This is an internal enterprise system for a medical company that manages both medical devices and medical consumables.

Do NOT create a marketing site.
This must feel like a serious enterprise ERP.

---------------------------------------------------
CORE RULES
---------------------------------------------------

Workflow:
- Product-first structure (default)
- Client-first toggle available

Policies:
- Credit limit: WARN only, allow proceed
- Tax invoice auto-created on shipment confirmation (status: 발행대기)
- Consumables: FEFO auto recommendation

Tone:
- Premium
- Masculine
- Enterprise B2B
- Data-dense
- Operational
- No playful UI
- No ecommerce feel
- No oversized cards
- Strong table-based layout

---------------------------------------------------
DESIGN SYSTEM SETUP
---------------------------------------------------

Create a full design system including:

1. COLOR TOKENS

Primary:
- Navy 900: #0F172A
- Navy 800: #1E293B
- Navy 700: #334155

Neutral:
- Gray 50: #F8FAFC
- Gray 100: #F1F5F9
- Gray 200: #E2E8F0
- Gray 400: #94A3B8
- Gray 600: #475569
- Gray 800: #1E293B

Status:
- Success: #16A34A
- Warning: #F59E0B
- Danger: #DC2626
- Info: #2563EB

Background:
- Sidebar: Navy 900
- Main content: White
- Section background: Gray 50

2. TYPOGRAPHY TOKENS

Font:
- Pretendard or Inter

Scale:
- Title Large: 20px / 600
- Title Medium: 18px / 600
- Body Large: 16px / 500
- Body Medium: 14px / 500
- Caption: 12px / 400

Line height: 1.4

3. SPACING SYSTEM

Base unit: 4px
Spacing scale:
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48

4. BORDER RADIUS

- Small: 6px
- Medium: 8px
- Large: 12px

ERP style: mostly 6–8px

5. SHADOW

Very subtle only:
- Card Shadow: 0 1px 2px rgba(0,0,0,0.05)

Avoid heavy shadows.

---------------------------------------------------
GRID SYSTEM
---------------------------------------------------

Desktop:
- Width 1440
- 12 columns
- Margin 24
- Gutter 16
- Two panel layout: 7/12 + 5/12

Tablet:
- 12 columns
- Single column stacked with tabs

Mobile:
- 4 columns
- Margin 16
- Gutter 12
- Tab-switch layout
- Bottom sheet for detail

---------------------------------------------------
COMPONENT SYSTEM
---------------------------------------------------

Create reusable components with variants:

1. Sidebar Navigation
- Default
- Active
- Collapsed

2. Top Header
- With search
- With actions

3. Toggle Tabs
- Default
- Active

4. Filter Chips
- Default
- Selected

5. Buttons
- Primary
- Secondary
- Ghost
- Danger
- Disabled

6. Status Badge
- Success
- Warning
- Danger
- Neutral
- Info

7. Data Table
- Header
- Row
- Hover
- Selected
- With action column

8. Inspector Panel (Right drawer)
- Open
- Closed

9. Bottom Sheet (Mobile)
- Default
- With action bar

10. KPI Strip
Single-line compact metric layout (no tall cards)

11. Stepper
- 5-step horizontal
- Active step highlight

---------------------------------------------------
MAIN SCREENS
---------------------------------------------------

Create full layouts for:

1. INVENTORY (Product-first default)
- Product selector
- KPI strip
- 2-panel layout
- Left: inventory units (serial/lot)
- Right: related clients + actions

2. SHIPMENT CREATION
- 5-step process
- FEFO highlighted lots
- Serial selection required
- Credit warning badge
- Confirmation summary box

3. TAX INVOICE
- Shipment-based issuance
- Status column
- Inspector with lot/serial display

4. SETTLEMENT
- KPI strip
- Client settlement table
- Credit utilization visual indicator

5. INSTALLATION
- Device installation tracking table

6. A/S MANAGEMENT
- Ticket table
- Priority badge
- Status tracking

7. CLIENT MANAGEMENT
- Summary strip
- Installed devices section
- Consumables purchase history

8. ALERT CENTER
- Alert table
- Status + severity indicators

9. AUDIT LOG
- Before/After change columns
- Highlight critical changes

---------------------------------------------------
RESPONSIVE BEHAVIOR
---------------------------------------------------

Desktop:
- Fixed sidebar
- 2 panel layout

Mobile:
- Sidebar becomes drawer
- KPI becomes horizontal scroll chips
- Tables become two-line list rows
- Detail opens in bottom sheet

---------------------------------------------------
NAMING CONVENTION
---------------------------------------------------

Use consistent naming:

Layout/
Component/
Table/
Form/
Badge/
Button/
Nav/
Modal/
Drawer/

Example:
Component/Button/Primary
Component/Badge/Warning
Layout/Inventory/Desktop
Layout/Inventory/Mobile

---------------------------------------------------
FINAL REQUIREMENT
---------------------------------------------------

Build the entire UI system in one consistent style.
Make it realistic and operational.
Prioritize clarity over decoration.
Keep spacing tight and professional.
Avoid excessive empty space.
Avoid consumer app styling.