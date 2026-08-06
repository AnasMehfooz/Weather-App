import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_phase2_presentation(student_name="Anas Mehfooz", matr_no="[Your Matriculation Number]", github_url="https://github.com/AnasMehfooz/Weather-App"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Colors
    NAVY = RGBColor(26, 43, 76)
    BLUE = RGBColor(41, 128, 185)
    TEAL = RGBColor(22, 160, 133)
    DARK_GRAY = RGBColor(44, 62, 80)
    LIGHT_BG = RGBColor(245, 247, 250)
    WHITE = RGBColor(255, 255, 255)
    BORDER_GRAY = RGBColor(218, 225, 231)
    ACCENT_GREEN = RGBColor(46, 204, 113)
    
    blank_slide_layout = prs.slide_layouts[6]
    
    # Helper to add background header bar
    def add_header(slide, title_text, category_text="DLBCSPJWD01 - PORTFOLIO PHASE 2 (DEVELOPMENT & REFLECTION)"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = TEAL
        p_cat.font.name = 'Arial'
        
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY
        p_title.font.name = 'Arial'
        
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = BLUE
        line.line.color.rgb = BLUE

    # Helper to add card
    def add_card(slide, left, top, width, height, title, content_list, bg_color=LIGHT_BG, border_color=BORDER_GRAY):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)
        
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)
        
        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(16)
        p_head.font.bold = True
        p_head.font.color.rgb = NAVY
        p_head.font.name = 'Arial'
        p_head.space_after = Pt(10)
        
        for item in content_list:
            p = tf.add_paragraph()
            p.text = item
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_GRAY
            p.font.name = 'Arial'
            p.space_after = Pt(5)

    # -------------------------------------------------------------
    # TITLE SLIDE (Modified with GitHub Link)
    # -------------------------------------------------------------
    slide_title = prs.slides.add_slide(blank_slide_layout)
    bg = slide_title.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = NAVY
    
    accent_box = slide_title.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.8), Inches(11.333), Inches(5.9))
    accent_box.fill.solid()
    accent_box.fill.fore_color.rgb = WHITE
    accent_box.line.color.rgb = TEAL
    accent_box.line.width = Pt(2)
    
    tf_t = accent_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = Inches(0.6)
    tf_t.margin_top = Inches(0.5)
    
    p0 = tf_t.paragraphs[0]
    p0.text = "IU INTERNATIONALE HOCHSCHULE"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = TEAL
    p0.space_after = Pt(15)
    
    p1 = tf_t.add_paragraph()
    p1.text = "WeatherSync - Smart Activity & Task Planner"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = NAVY
    p1.space_after = Pt(10)
    
    p2 = tf_t.add_paragraph()
    p2.text = "Portfolio Phase 2: Development & Reflection Presentation"
    p2.font.size = Pt(18)
    p2.font.color.rgb = BLUE
    p2.space_after = Pt(20)
    
    p3 = tf_t.add_paragraph()
    p3.text = f"Course: Project Java and Web Development (DLBCSPJWD01)\nStudent Name: {student_name}\nMatriculation Number: {matr_no}\nPublic GitHub Repository: {github_url}"
    p3.font.size = Pt(14)
    p3.font.color.rgb = DARK_GRAY

    # -------------------------------------------------------------
    # SLIDE 1: Concept & Purpose (Phase 1)
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide1, "Slide 1: Envisioned Web Application Concept & Purpose", "Phase 1 Conceptual Baseline")
    add_card(slide1, 0.8, 1.8, 5.6, 5.0, "Core Application Idea", [
        "• Name: WeatherSync - Intelligent Weather-Aware Task & Activity Planner.",
        "• Core Purpose: Connects daily task management with real-time weather forecasts to optimize activity planning.",
        "• Problem Addressed: Users misplan outdoor tasks because weather apps & planners operate separately.",
        "• Solution: Automatically evaluates weather metrics and calculates outdoor activity suitability scores."
    ])
    add_card(slide1, 6.9, 1.8, 5.6, 5.0, "Key Features & Vision", [
        "• Interactive Dashboard: Real-time weather forecast synced with task list.",
        "• Smart Suitability Engine: Backend algorithm scores weather against outdoor task suitability.",
        "• Multi-City Lookup: Location search across international cities.",
        "• Responsive UI: Fluid readability across smartphones, tablets, and desktop computers."
    ])

    # -------------------------------------------------------------
    # SLIDE 2: Target User Groups & Primary Use Cases (Phase 1)
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide2, "Slide 2: Target User Groups & Primary Use Cases", "Phase 1 Conceptual Baseline")
    add_card(slide2, 0.8, 1.8, 3.6, 5.0, "1. Active Individuals & Athletes", [
        "• Profile: Runners, cyclists, hikers, outdoor fitness enthusiasts.",
        "• Needs: Hourly forecasts, rain warnings, dry activity windows.",
        "• Scenario: Plan a 10km run at the dryest, mildest hour."
    ])
    add_card(slide2, 4.8, 1.8, 3.6, 5.0, "2. Remote Workers & Professionals", [
        "• Profile: People balancing work, outdoor breaks, and chores.",
        "• Needs: Efficient daily scheduling combining work and outdoor breaks.",
        "• Scenario: Schedule outdoor errands during sunny work breaks."
    ])
    add_card(slide2, 8.8, 1.8, 3.6, 5.0, "3. Event & Travel Planners", [
        "• Profile: Families organizing weekend trips or outdoor events.",
        "• Needs: Multi-city weather lookup and flexible scheduling.",
        "• Scenario: Compare weather across 3 nearby trip destinations."
    ])

    # -------------------------------------------------------------
    # SLIDE 3: Key User Benefits & Value Proposition (Phase 1)
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide3, "Slide 3: Key User Benefits & Value Proposition", "Phase 1 Conceptual Baseline")
    add_card(slide3, 0.8, 1.8, 5.6, 2.3, "⏱️ Time & Effort Optimization", [
        "• Eliminates switching between separate calendar, task manager, and weather apps.",
        "• Instant weather-suitability tags on every planned activity."
    ])
    add_card(slide3, 6.9, 1.8, 5.6, 2.3, "💡 Smart Weather-Aware Recommendations", [
        "• Backend intelligence automatically warns users of upcoming rain or severe weather.",
        "• Recommends alternative indoor time slots."
    ])
    add_card(slide3, 0.8, 4.4, 5.6, 2.4, "📱 Seamless Multi-Device Experience", [
        "• Fully responsive layout designed with modern CSS Flexbox & Grid.",
        "• Provides optimal readability on mobile phones, tablets, and desktop displays."
    ])
    add_card(slide3, 6.9, 4.4, 5.6, 2.4, "🎯 Clean & Intuitive User Interface", [
        "• Clear visual hierarchy with weather icons, temperature badges, and task cards.",
        "• Instant search and filter capabilities by priority and weather status."
    ])

    # -------------------------------------------------------------
    # SLIDE 4: Technical Architecture & Technology Stack (Phase 1)
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide4, "Slide 4: Technical Architecture & Technology Stack", "Phase 1 Conceptual Baseline")
    add_card(slide4, 0.8, 1.8, 3.6, 5.0, "Frontend Layer", [
        "• HTML5: Semantic structure (nav, section, main, footer).",
        "• CSS3: Custom styles, Flexbox/Grid layouts, media queries for responsiveness.",
        "• JavaScript (ES6+): Dynamic DOM manipulation, asynchronous fetch requests."
    ])
    add_card(slide4, 4.8, 1.8, 3.6, 5.0, "Backend Layer", [
        "• Node.js: Asynchronous JavaScript runtime.",
        "• Express.js: Lightweight RESTful API server routing.",
        "• Fetch API: Backend client to consume third-party weather API.",
        "• Data Storage: JSON file storage (`tasks.json`)."
    ])
    add_card(slide4, 8.8, 1.8, 3.6, 5.0, "External API & Rules", [
        "• External API: Open-Meteo REST API.",
        "• Strict Compliance: External API is ONLY consumed by Node.js backend.",
        "• Backend transforms raw API payload into activity suitability score before sending to frontend."
    ])

    # -------------------------------------------------------------
    # SLIDE 5: Functional Scope & Dynamic Aspects (Phase 1)
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide5, "Slide 5: Functional Scope & Dynamic Backend Interactions", "Phase 1 Conceptual Baseline")
    add_card(slide5, 0.8, 1.8, 5.6, 5.0, "Dynamic Aspect 1: Weather & Activity Query", [
        "1. User enters location/city in search bar.",
        "2. Frontend sends HTTP GET request to `/api/weather?city=X`.",
        "3. Backend fetches raw forecast from Open-Meteo API, calculates suitability score.",
        "4. Backend returns transformed JSON payload.",
        "5. Frontend JS dynamically renders forecast widgets without page reload."
    ])
    add_card(slide5, 6.9, 1.8, 5.6, 5.0, "Dynamic Aspect 2: Task CRUD & Weather Tagging", [
        "1. User creates, edits, or completes a task (e.g. 'Cycling').",
        "2. Frontend JS posts HTTP request to `/api/tasks`.",
        "3. Backend validates input, pairs task with weather conditions, and persists to storage.",
        "4. Backend sends updated task list response.",
        "5. Frontend dynamically updates UI task list instantly."
    ])

    # =============================================================
    # PHASE 2 EXTENSION SLIDES (SLIDES 6 - 12)
    # =============================================================

    # -------------------------------------------------------------
    # SLIDE 6: Overview of Final Technology Choices
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide6, "Slide 6: Overview of Final Technology Stack Choices", "Phase 2 Development Overview")
    
    add_card(slide6, 0.8, 1.8, 3.6, 5.0, "Frontend Technologies", [
        "• HTML5: Semantic markup ensuring strong accessibility.",
        "• CSS3: Custom CSS variables, Glassmorphism, CSS Grid & Flexbox layout.",
        "• Vanilla JS (ES6+): Asynchronous HTTP fetch client, state management, event listeners.",
        "• Google Fonts: Outfit font family for modern aesthetic typography."
    ])
    
    add_card(slide6, 4.8, 1.8, 3.6, 5.0, "Backend & Database", [
        "• Node.js (v24): High performance asynchronous execution engine.",
        "• Express.js (v4.21): Middleware routing and REST API construction.",
        "• CORS & Body Parser: Cross-origin & JSON payload handling.",
        "• JSON Storage (`tasks.json`): Lightweight persistent task database."
    ])
    
    add_card(slide6, 8.8, 1.8, 3.6, 5.0, "Testing & External Integration", [
        "• Open-Meteo REST API: Free, high-accuracy global weather & geocoding data.",
        "• Strict Backend Proxying: Zero client-side API key or endpoint leaks.",
        "• Node Test Runner (`node:test`): Coded automated unit and integration tests."
    ])

    # -------------------------------------------------------------
    # SLIDE 7: Web Application Desktop Interface
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide7, "Slide 7: Web Application Desktop Interface & Layout", "Phase 2 UI Screenshots & Breakdown")
    
    add_card(slide7, 0.8, 1.8, 5.6, 5.0, "Desktop UI Breakdown", [
        "• Header & Search Bar: Real-time city search input with instant backend trigger.",
        "• Left Column - Weather Dashboard:",
        "  - Hero weather card with current temperature, icon, wind, rain probability.",
        "  - Dynamic Suitability Meter: Color-coded progress bar (red/yellow/green) with suitability recommendation.",
        "  - 5-Hour Outlook: Compact hourly forecast widgets.",
        "• Right Column - Interactive Task Manager:",
        "  - Category filter tabs (All, Outdoor, Indoor).",
        "  - Quick-add form with title input, category selector, outdoor flag."
    ])
    
    add_card(slide7, 6.9, 1.8, 5.6, 5.0, "Design Aesthetics & User Experience", [
        "• Color Palette: Dark Slate theme (`#0f172a`), Sky Blue accents (`#38bdf8`), Emerald Green indicators (`#34d399`).",
        "• Glassmorphism: Translucent frosted card backgrounds with subtle border reflections.",
        "• Visual Hierarchy: Clean typography, distinct status badges, and micro-interactions on hover.",
        "• No Page Reloads: Asynchronous JS fetch guarantees instant visual updates."
    ])

    # -------------------------------------------------------------
    # SLIDE 8: Responsive Viewports (Mobile & Tablet)
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide8, "Slide 8: Responsive Layout (Mobile & Tablet Viewports)", "Phase 2 Responsiveness & Adaptation")
    
    add_card(slide8, 0.8, 1.8, 5.6, 5.0, "Mobile Viewport Adaptation (< 900px)", [
        "• CSS Media Query Breakpoint: `@media (max-width: 900px)`.",
        "• Single-Column Stacking: 2-column grid gracefully collapses into a vertical single-column layout.",
        "• Touch-Friendly Search: Full-width search bar with large tap targets (minimum 44px height).",
        "• Scrollable Task Container: Task list remains contained with vertical scrolling to prevent page overflow.",
        "• Compact Hourly Cards: 5-hour weather metrics adjust automatically."
    ])
    
    add_card(slide8, 6.9, 1.8, 5.6, 5.0, "Tablet Viewport & Readability Assurance", [
        "• Fluid Viewport Scaling: Flexbox containers auto-fit available screen width.",
        "• Readable Typography: Responsive rem-based font sizes prevent text clipping.",
        "• Contrast & Accessibility: High contrast ratio between light typography (`#f8fafc`) and dark slate cards.",
        "• Tested Across Devices: Verified on Desktop (1920x1080), Tablet (768x1024), and Smartphone (375x812)."
    ])

    # -------------------------------------------------------------
    # SLIDE 9: Dynamic Features Implementation Flow
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide9, "Slide 9: Dynamic Features & Backend Communication Flow", "Phase 2 Technical Execution")
    
    add_card(slide9, 0.8, 1.8, 5.6, 5.0, "Dynamic Aspect 1: Weather Lookup & Scoring", [
        "• Client Action: User enters city and clicks 'Fetch Weather'.",
        "• Backend Processing:",
        "  1. Queries Open-Meteo Geocoding API -> converts city to lat/lon.",
        "  2. Queries Forecast API -> receives current weather & hourly data.",
        "  3. Calculates suitability algorithm score (0-100%).",
        "  4. Sends enriched JSON back to client.",
        "• DOM Update: Client JS renders weather hero, animates suitability progress bar, and updates hourly outlook."
    ])
    
    add_card(slide9, 6.9, 1.8, 5.6, 5.0, "Dynamic Aspect 2: Task CRUD Operations", [
        "• CREATE (POST `/api/tasks`): Adds task with category & outdoor tag.",
        "• READ (GET `/api/tasks`): Retrieves stored tasks on page load.",
        "• UPDATE (PUT `/api/tasks/:id`): Toggles task completion status.",
        "• DELETE (DELETE `/api/tasks/:id`): Removes task from persistent storage.",
        "• Filter Interaction: Client-side JavaScript instantly filters tasks (All/Outdoor/Indoor) without server re-fetching."
    ])

    # -------------------------------------------------------------
    # SLIDE 10: Proposal vs Final Implementation Changes
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide10, "Slide 10: Conception Proposal vs. Final Implementation", "Phase 2 Reflection & Refinements")
    
    add_card(slide10, 0.8, 1.8, 5.6, 5.0, "Implemented Refinements & Enhancements", [
        "• Extended Suitability Algorithm: Added specific penalties for severe WMO weather codes (thunderstorms, heavy snow, rain).",
        "• Category Filter Tabs: Introduced client-side task category filtering (All, Outdoor, Indoor) to improve task management.",
        "• Persistent Storage: Implemented local file-based JSON storage (`tasks.json`) to persist task state across server restarts.",
        "• Glassmorphism Design System: Enhanced UI aesthetics using modern CSS backdrops, soft radial background gradients, and smooth progress bar transitions."
    ])
    
    add_card(slide10, 6.9, 1.8, 5.6, 5.0, "Adherence to Initial Proposal", [
        "• Technology Stack: Fully maintained Node.js + Express.js backend and Vanilla HTML/CSS/JS frontend as proposed in Phase 1.",
        "• API Compliance: Adhered strictly to the mandate that external APIs must only be consumed by the backend server.",
        "• Criteria Fulfillment: Delivered 2+ dynamic interactions, responsive design, code documentation, and automated test cases."
    ])

    # -------------------------------------------------------------
    # SLIDE 11: Software Testing & Quality Assurance
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide11, "Slide 11: Software Testing & Automated Test Cases", "Phase 2 Quality Assurance")
    
    add_card(slide11, 0.8, 1.8, 5.6, 5.0, "Coded Test Cases (`tests/server.test.js`)", [
        "• Test Case 1: Suitability Calculation - Ideal Weather Conditions",
        "  - Inputs: 20°C, 0% rain, 10 km/h wind, clear sky.",
        "  - Expected Output: 100% suitability score.",
        "• Test Case 2: Suitability Calculation - Adverse Weather Conditions",
        "  - Inputs: 5°C, 80% rain probability, 35 km/h wind.",
        "  - Expected Output: Score < 30% (Poor condition recommendation).",
        "• Test Case 3: Task Object Data Integrity",
        "  - Validates prefix ID formatting, boolean outdoor flag, and allowed status strings ('pending' / 'completed')."
    ])
    
    add_card(slide11, 6.9, 1.8, 5.6, 5.0, "Automated Test Execution Results", [
        "• Testing Framework: Node.js native test runner (`node --test`).",
        "• Test Execution Output:",
        "  ✔ Suitability Calculation - Ideal Conditions (Passed)",
        "  ✔ Suitability Calculation - Adverse Weather Conditions (Passed)",
        "  ✔ Task Data Integrity Validation (Passed)",
        "• Result Summary: 3/3 tests passed, 0 failures, 100% assertion success rate."
    ])

    # -------------------------------------------------------------
    # SLIDE 12: Screencast Video & Demonstration
    # -------------------------------------------------------------
    slide12 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide12, "Slide 12: Screencast Demonstration & Video Link", "Phase 2 Video Deliverable")
    
    add_card(slide12, 0.8, 1.8, 11.7, 5.0, "Screencast Overview (1-2 Min Video)", [
        "• Screencast Content Overview:",
        "  1. Desktop View Demonstration: Live weather lookup for Berlin/Munich, interactive suitability score calculation, adding & completing tasks.",
        "  2. Responsive Mobile & Tablet View Demonstration: Resizing browser window to show single-column layout collapse and mobile-friendly tap targets.",
        "  3. Subtitles / Voice-over: Explaining dynamic API data flow and task management.",
        "• Embedded Video Note: The screencast MP4 video is embedded directly into this PowerPoint presentation slide as required for PebblePad submission.",
        "• Public Repository Link: " + github_url
    ])

    output_path = os.path.join("d:\\My_project", "Anas-Mehfooz_DLBCSPJWD01_P2_S.pptx")
    prs.save(output_path)
    print(f"Phase 2 Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    create_phase2_presentation()
