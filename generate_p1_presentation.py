import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(student_name="[Your Name]", matr_no="[Your Matriculation Number]"):
    prs = Presentation()
    # Set slide width and height to 16:9 widescreen
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
    
    blank_slide_layout = prs.slide_layouts[6]
    
    # Helper to add background header bar
    def add_header(slide, title_text, category_text="DLBCSPJWD01 - PORTFOLIO PHASE 1"):
        # Category / Header small text
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = TEAL
        p_cat.font.name = 'Arial'
        
        # Title text
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY
        p_title.font.name = 'Arial'
        
        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = BLUE
        line.line.color.rgb = BLUE

    # Helper to add a card block
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
        
        # Card Header
        p_head = tf.paragraphs[0]
        p_head.text = title
        p_head.font.size = Pt(16)
        p_head.font.bold = True
        p_head.font.color.rgb = NAVY
        p_head.font.name = 'Arial'
        p_head.space_after = Pt(12)
        
        # Bullet content
        for item in content_list:
            p = tf.add_paragraph()
            p.text = item
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_GRAY
            p.font.name = 'Arial'
            p.space_after = Pt(6)
            p.level = 0

    # -------------------------------------------------------------
    # TITLE SLIDE (Not counted in the 5 slides limit)
    # -------------------------------------------------------------
    slide_title = prs.slides.add_slide(blank_slide_layout)
    
    # Background banner
    bg = slide_title.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = NAVY
    bg.line.color.rgb = NAVY
    
    # Inner accent box
    accent_box = slide_title.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.0), Inches(11.333), Inches(5.5))
    accent_box.fill.solid()
    accent_box.fill.fore_color.rgb = WHITE
    accent_box.line.color.rgb = TEAL
    accent_box.line.width = Pt(2)
    
    tf_t = accent_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = Inches(0.6)
    tf_t.margin_top = Inches(0.6)
    
    p0 = tf_t.paragraphs[0]
    p0.text = "IU INTERNATIONALE HOCHSCHULE"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = TEAL
    p0.space_after = Pt(20)
    
    p1 = tf_t.add_paragraph()
    p1.text = "WeatherSync - Smart Activity & Task Planner"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = NAVY
    p1.space_after = Pt(10)
    
    p2 = tf_t.add_paragraph()
    p2.text = "Portfolio Phase 1: Conceptual Design Presentation"
    p2.font.size = Pt(20)
    p2.font.color.rgb = BLUE
    p2.space_after = Pt(30)
    
    p3 = tf_t.add_paragraph()
    p3.text = f"Course: Project Java and Web Development (DLBCSPJWD01)\nStudent Name: {student_name}\nMatriculation Number: {matr_no}\nDate: August 2026"
    p3.font.size = Pt(14)
    p3.font.color.rgb = DARK_GRAY

    # -------------------------------------------------------------
    # SLIDE 1: Envisioned Web Application Concept & Purpose
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide1, "Slide 1: Envisioned Web Application Concept & Purpose")
    
    add_card(slide1, 0.8, 1.8, 5.6, 5.0, "Core Application Idea", [
        "• Name: WeatherSync - Intelligent Weather-Aware Task & Activity Planner.",
        "• Core Purpose: A dynamic web application that connects daily task management with real-time weather forecasts to optimize outdoor & indoor schedule planning.",
        "• Problem Addressed: Users frequently misplan outdoor activities (sports, commuting, errands, events) due to checking weather apps separately from their task planners.",
        "• Solution: WeatherSync automatically evaluates local weather metrics (temperature, precipitation, wind) and recommends the best time slots for user tasks."
    ])
    
    add_card(slide1, 6.9, 1.8, 5.6, 5.0, "Key Features & Vision", [
        "• Interactive Dashboard: Real-time 5-day weather view synchronized with user schedule.",
        "• Smart Suitability Engine: Backend algorithm scores outdoor tasks (e.g., 'Jogging', 'Car Wash') against current weather conditions.",
        "• Location-Based Tracking: Seamless weather lookup for multiple user-defined cities.",
        "• Responsive Web UI: Works smoothly across smartphones, tablets, and desktop computers."
    ])

    # -------------------------------------------------------------
    # SLIDE 2: Target User Groups & Use Cases
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide2, "Slide 2: Target User Groups & Primary Use Cases")
    
    add_card(slide2, 0.8, 1.8, 3.6, 5.0, "1. Active Individuals & Athletes", [
        "• Profile: Runners, cyclists, hikers, and outdoor fitness enthusiasts.",
        "• Needs: Precise hourly forecasts, rain warnings, and optimal activity windows.",
        "• Example Scenario: Plan a 10km run at the dryest, mildest hour of the afternoon."
    ])
    
    add_card(slide2, 4.8, 1.8, 3.6, 5.0, "2. Remote Workers & Professionals", [
        "• Profile: Busy individuals balancing work, outdoor breaks, and daily household chores.",
        "• Needs: Efficient daily scheduling combining indoor work sessions with outdoor errands.",
        "• Example Scenario: Automatically schedule lawn mowing or errands during sunny work breaks."
    ])
    
    add_card(slide2, 8.8, 1.8, 3.6, 5.0, "3. Event & Travel Planners", [
        "• Profile: Families and groups organizing weekend trips, picnics, or outdoor events.",
        "• Needs: Multi-city weather lookup and flexible event scheduling.",
        "• Example Scenario: Compare weather across 3 nearby destinations for a weekend trip."
    ])

    # -------------------------------------------------------------
    # SLIDE 3: Key User Benefits & Value Proposition
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide3, "Slide 3: Key User Benefits & Value Proposition")
    
    add_card(slide3, 0.8, 1.8, 5.6, 2.3, "⏱️ Time & Effort Optimization", [
        "• Eliminates manually switching between separate calendar, task manager, and weather forecast apps.",
        "• Instant weather-suitability tags on every planned activity."
    ])
    
    add_card(slide3, 6.9, 1.8, 5.6, 2.3, "💡 Smart Weather-Aware Recommendations", [
        "• Backend intelligence automatically warns users of upcoming rain or severe weather before outdoor tasks.",
        "• Recommends alternative indoor time slots."
    ])
    
    add_card(slide3, 0.8, 4.4, 5.6, 2.4, "📱 Seamless Multi-Device Experience", [
        "• Fully responsive layout designed with modern CSS (Flexbox & Grid).",
        "• Provides optimal readability on mobile phones, tablets, and desktop displays."
    ])
    
    add_card(slide3, 6.9, 4.4, 5.6, 2.4, "🎯 Clean & Intuitive User Interface", [
        "• Clear visual hierarchy with weather icons, temperature badges, and interactive task cards.",
        "• Instant search and filter capabilities by priority and weather status."
    ])

    # -------------------------------------------------------------
    # SLIDE 4: Technical Architecture & Technology Choices
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide4, "Slide 4: Technical Architecture & Technology Stack")
    
    add_card(slide4, 0.8, 1.8, 3.6, 5.0, "Frontend Layer", [
        "• HTML5: Semantic structure (nav, section, main, footer).",
        "• CSS3: Custom styles, CSS variables, Flexbox/Grid layouts, media queries for responsiveness.",
        "• JavaScript (ES6+): Dynamic DOM manipulation, asynchronous fetch requests, event handling."
    ])
    
    add_card(slide4, 4.8, 1.8, 3.6, 5.0, "Backend Layer", [
        "• Node.js: High-performance asynchronous JavaScript runtime.",
        "• Express.js: Lightweight RESTful API server routing and middleware.",
        "• Axios / Fetch: Backend client to consume third-party weather API.",
        "• Data Persistence: JSON file storage / MongoDB (Mongoose)."
    ])
    
    add_card(slide4, 8.8, 1.8, 3.6, 5.0, "External API & Compliance", [
        "• External API: Open-Meteo REST API (or OpenWeatherMap API).",
        "• Strict Guideline Adherence: External API is ONLY consumed by the Node.js backend.",
        "• Backend transforms raw API data into refined activity scores before delivering to frontend."
    ])

    # -------------------------------------------------------------
    # SLIDE 5: Functional Scope & Dynamic Backend Interactions
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide5, "Slide 5: Functional Scope & Dynamic Aspects (Req. 2+ Interactions)")
    
    add_card(slide5, 0.8, 1.8, 5.6, 5.0, "Dynamic Interaction 1: Weather & Activity Query", [
        "1. User enters location/city in Frontend JS input.",
        "2. Frontend sends HTTP GET request to Node.js Backend `/api/weather?city=X`.",
        "3. Backend fetches raw forecast from Open-Meteo API, calculates task suitability score.",
        "4. Backend returns processed weather JSON payload.",
        "5. Frontend JS dynamically renders forecast widgets & suitability badges without page refresh."
    ])
    
    add_card(slide5, 6.9, 1.8, 5.6, 5.0, "Dynamic Interaction 2: Task CRUD & Weather Tagging", [
        "1. User creates, edits, or completes a task (e.g. 'Cycling at 4 PM').",
        "2. Frontend JS posts HTTP POST/PUT/DELETE request to Backend `/api/tasks`.",
        "3. Backend validates input, pairs task with weather conditions, and persists to database/storage.",
        "4. Backend sends updated task list response back.",
        "5. Frontend dynamically updates UI task list & weather status icons instantly."
    ])

    output_path = os.path.join("d:\\My_project", "Mustermann-Max_12345678_DLBCSPJWD01_P1_S.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    create_presentation()
