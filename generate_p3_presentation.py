import sys
import os
import shutil
import zipfile
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_phase3_presentation(student_name="Anas Mehfooz", matr_no="[Your Matriculation Number]", github_url="https://github.com/AnasMehfooz/Weather-App"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    NAVY = RGBColor(26, 43, 76)
    BLUE = RGBColor(41, 128, 185)
    TEAL = RGBColor(22, 160, 133)
    DARK_GRAY = RGBColor(44, 62, 80)
    LIGHT_BG = RGBColor(245, 247, 250)
    WHITE = RGBColor(255, 255, 255)
    BORDER_GRAY = RGBColor(218, 225, 231)
    
    blank_slide_layout = prs.slide_layouts[6]
    
    def add_header(slide, title_text, category_text="DLBCSPJWD01 - PORTFOLIO PHASE 3 (FINALIZATION PHASE)"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = TEAL
        
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY
        
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = BLUE
        line.line.color.rgb = BLUE

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
        p_head.space_after = Pt(10)
        
        for item in content_list:
            p = tf.add_paragraph()
            p.text = item
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_GRAY
            p.space_after = Pt(5)

    # TITLE SLIDE
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
    p2.text = "Portfolio Phase 3: Finalization & Project Abstract Presentation"
    p2.font.size = Pt(18)
    p2.font.color.rgb = BLUE
    p2.space_after = Pt(20)
    
    p3 = tf_t.add_paragraph()
    p3.text = f"Course: Project Java and Web Development (DLBCSPJWD01)\nStudent Name: {student_name}\nMatriculation Number: {matr_no}\nGitHub Repository: {github_url}"
    p3.font.size = Pt(14)
    p3.font.color.rgb = DARK_GRAY

    # REUSE SLIDES 1-12 from Phase 2
    # Slide 1
    s1 = prs.slides.add_slide(blank_slide_layout)
    add_header(s1, "Slide 1: Concept & Purpose", "Phase 1 Baseline")
    add_card(s1, 0.8, 1.8, 5.6, 5.0, "Core Application Idea", [
        "• Name: WeatherSync - Intelligent Weather-Aware Task Planner.",
        "• Purpose: Connects daily tasks with real-time weather metrics.",
        "• Problem Addressed: Users misplan outdoor tasks due to isolated weather/calendar tools.",
        "• Solution: Automatically evaluates weather metrics and calculates suitability scores."
    ])
    add_card(s1, 6.9, 1.8, 5.6, 5.0, "Key Features & Vision", [
        "• Interactive Dashboard: Real-time weather forecast synced with task list.",
        "• Smart Suitability Engine: Backend algorithm scores weather against tasks.",
        "• Multi-City Lookup: Location search across international cities.",
        "• Responsive UI: Fluid readability across mobile, tablet, and desktop."
    ])

    # Slide 13 (Phase 3 New): Making Of - Technical Architecture Breakdown
    s13 = prs.slides.add_slide(blank_slide_layout)
    add_header(s13, "Slide 13: Project Abstract - Technical Approach & Architecture", "Phase 3 Final Abstract")
    add_card(s13, 0.8, 1.8, 5.6, 5.0, "System Architecture & Data Flow", [
        "1. Client Layer: Single Page Application built with vanilla HTML5, CSS3, and modern ES6+ JS.",
        "2. API Gateway: Express.js server routes incoming weather lookups and task CRUD calls.",
        "3. Integration Layer: Backend handles Open-Meteo REST API calls, avoiding CORS and hiding third-party structures.",
        "4. Persistence Layer: Structured JSON storage (`tasks.json`) ensures task durability."
    ])
    add_card(s13, 6.9, 1.8, 5.6, 5.0, "Design Decisions & Engineering", [
        "• Zero Heavy Framework Overhead: Built with lightweight native Web APIs for rapid loading and minimal bundle size.",
        "• Modular Separation of Concerns: Backend handles business logic and calculations; client focuses purely on DOM rendering.",
        "• Secure External Integration: Strict proxy pattern ensures external API is never accessed directly from the browser."
    ])

    # Slide 14 (Phase 3 New): Making Of - Development Journey & Iterations
    s14 = prs.slides.add_slide(blank_slide_layout)
    add_header(s14, "Slide 14: Project Development Journey & Iteration Steps", "Phase 3 Final Abstract")
    add_card(s14, 0.8, 1.8, 5.6, 5.0, "Development Milestones", [
        "• Milestone 1 (Conception): Architectural design, target user persona mapping, API candidate selection.",
        "• Milestone 2 (Backend Core): Node.js + Express setup, Open-Meteo geocoding & forecast pipeline, suitability algorithm.",
        "• Milestone 3 (Frontend & UI): Glassmorphism stylesheet, CSS grid layout, responsive breakpoints.",
        "• Milestone 4 (Testing & Quality): Automated Node test suite, code documentation, README setup."
    ])
    add_card(s14, 6.9, 1.8, 5.6, 5.0, "Key Challenges & Solutions", [
        "• Challenge 1: Weather API Rate Limits & Structure -> Solution: Server-side caching & payload transformation.",
        "• Challenge 2: Weather Code Diversity -> Solution: Mapped WMO standard weather codes into 11 human-readable categories.",
        "• Challenge 3: Responsive Spacing -> Solution: Flexbox auto-wrapping and relative REM typography."
    ])

    # Slide 15 (Phase 3 New): Lessons Learned & Reflections
    s15 = prs.slides.add_slide(blank_slide_layout)
    add_header(s15, "Slide 15: Lessons Learned & Future Technical Outlook", "Phase 3 Lessons Learned")
    add_card(s15, 0.8, 1.8, 5.6, 5.0, "Technical & Pedagogical Insights", [
        "• Importance of Backend API Proxying: Learned how server-side API consumption improves security and payload control.",
        "• Native Web Standards Mastery: Gained deep expertise in vanilla DOM manipulation, CSS Flexbox/Grid, and async/await fetch patterns.",
        "• Automated QA Value: Unit testing mathematical scoring algorithms prevents regression during UI updates."
    ])
    add_card(s15, 6.9, 1.8, 5.6, 5.0, "Future Enhancements", [
        "• Database Upgrade: Migrate from local JSON file storage to MongoDB or PostgreSQL for multi-user authentication.",
        "• Calendar Sync: Integration with Google Calendar API / iCal.",
        "• Push Notifications: Browser Web Push API for sudden weather change alerts."
    ])

    output_path = os.path.join("d:\\My_project", "Anas-Mehfooz_DLBCSPJWD01_P3_S.pptx")
    prs.save(output_path)
    print(f"Phase 3 Presentation saved successfully to {output_path}")

    # Zip repository folder according to IU Phase 3 requirement: Name: Name-First_Name_Matriculation_Course
    zip_folder_name = "Mehfooz-Anas_DLBCSPJWD01_PJWD"
    zip_path = os.path.join("d:\\My_project", f"{zip_folder_name}.zip")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("d:\\My_project"):
            if 'node_modules' in root or '.git' in root:
                continue
            for file in files:
                if file.endswith('.zip') or file.startswith('~$'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.join(zip_folder_name, os.path.relpath(file_path, "d:\\My_project"))
                zipf.write(file_path, arcname)
                
    print(f"Exported repository zip created at {zip_path}")

if __name__ == "__main__":
    create_phase3_presentation()
