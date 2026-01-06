"""
Japanese Garbage Classification Rules
完全な日本のゴミ分類ルール

Rules are based on Tokyo Metropolitan standards with ward variations.
東京都基準に基づく、区ごとの違いあり
"""

from typing import Dict, List
from pydantic import BaseModel

class PreparationStep(BaseModel):
    japanese: str
    english: str

class GarbageCategory(BaseModel):
    # Basic Info
    category_id: str
    japanese_name: str
    hiragana: str
    english_name: str
    
    # Description
    description_ja: str
    description_en: str
    
    # Examples
    examples_ja: List[str]
    examples_en: List[str]
    
    # Collection
    collection_day_ja: str
    collection_day_en: str
    collection_frequency: str  # weekly, biweekly, monthly
    
    # Preparation Steps
    preparation_steps: List[PreparationStep]
    
    # Important Notes
    notes_ja: List[str]
    notes_en: List[str]
    
    # Visual
    color: str
    icon: str


# Complete Garbage Classification Rules
GARBAGE_RULES: Dict[str, GarbageCategory] = {
    "glass": GarbageCategory(
        category_id="glass",
        japanese_name="びん・缶",
        hiragana="びん・かん",
        english_name="Glass Bottles & Cans",
        
        description_ja="ガラス製の瓶、飲料缶、食品缶など",
        description_en="Glass bottles, beverage cans, food cans",
        
        examples_ja=[
            "ビールびん",
            "ジュースの瓶",
            "ジャムの瓶",
            "調味料の瓶"
        ],
        examples_en=[
            "Beer bottles",
            "Juice bottles",
            "Jam jars",
            "Condiment bottles"
        ],
        
        collection_day_ja="月2回（第1・第3水曜日など）",
        collection_day_en="Twice a month (e.g., 1st & 3rd Wednesday)",
        collection_frequency="biweekly",
        
        preparation_steps=[
            PreparationStep(
                japanese="中身を空にして、水ですすぐ",
                english="Empty contents and rinse with water"
            ),
            PreparationStep(
                japanese="キャップとラベルを取り外す",
                english="Remove caps and labels"
            ),
            PreparationStep(
                japanese="色ごとに分別する（透明・茶色・その他）",
                english="Separate by color (clear, brown, other)"
            ),
            PreparationStep(
                japanese="割れたガラスは新聞紙に包む",
                english="Wrap broken glass in newspaper"
            )
        ],
        
        notes_ja=[
            "⚠️ 化粧品の瓶は「燃えないごみ」",
            "⚠️ 耐熱ガラスは「燃えないごみ」",
            "⚠️ 一升瓶は酒店へ返却"
        ],
        notes_en=[
            "⚠️ Cosmetic bottles → non-burnable waste",
            "⚠️ Heat-resistant glass → non-burnable waste",
            "⚠️ Return large sake bottles to liquor stores"
        ],
        
        color="#4A90E2",
        icon="🍾"
    ),
    
    "metal": GarbageCategory(
        category_id="metal",
        japanese_name="金属ごみ",
        hiragana="きんぞくごみ",
        english_name="Metal Waste",
        
        description_ja="小型の金属製品、缶類、アルミホイルなど",
        description_en="Small metal items, cans, aluminum foil",
        
        examples_ja=[
            "アルミ缶・スチール缶",
            "針金・クリップ",
            "アルミホイル",
            "金属製のフタ"
        ],
        examples_en=[
            "Aluminum/steel cans",
            "Wire, paper clips",
            "Aluminum foil",
            "Metal lids"
        ],
        
        collection_day_ja="月1回（第2水曜日など）",
        collection_day_en="Once a month (e.g., 2nd Wednesday)",
        collection_frequency="monthly",
        
        preparation_steps=[
            PreparationStep(
                japanese="中身を空にして、水ですすぐ",
                english="Empty and rinse with water"
            ),
            PreparationStep(
                japanese="缶は潰さずに出す",
                english="Don't crush cans (varies by ward)"
            ),
            PreparationStep(
                japanese="30cm以下のものに限る",
                english="Items must be under 30cm"
            ),
            PreparationStep(
                japanese="スプレー缶は穴を開ける",
                english="Puncture spray cans"
            )
        ],
        
        notes_ja=[
            "⚠️ 30cm以上は「粗大ごみ」",
            "⚠️ 電池は取り外して「有害ごみ」へ",
            "⚠️ スプレー缶は必ず使い切る"
        ],
        notes_en=[
            "⚠️ Items over 30cm → bulky waste",
            "⚠️ Remove batteries → hazardous waste",
            "⚠️ Empty spray cans completely"
        ],
        
        color="#95A5A6",
        icon="🥫"
    ),
    
    "organic": GarbageCategory(
        category_id="organic",
        japanese_name="燃えるごみ",
        hiragana="もえるごみ",
        english_name="Burnable Waste",
        
        description_ja="生ごみ、紙くず、汚れたプラスチック、木くずなど",
        description_en="Food waste, paper scraps, dirty plastic, wood",
        
        examples_ja=[
            "生ごみ（野菜くず・残飯）",
            "ティッシュ・紙おむつ",
            "汚れた紙・プラスチック",
            "枝・落ち葉（少量）"
        ],
        examples_en=[
            "Food waste (vegetable scraps, leftovers)",
            "Tissues, diapers",
            "Dirty paper/plastic",
            "Small branches, leaves"
        ],
        
        collection_day_ja="週2〜3回（月・木曜日など）",
        collection_day_en="2-3 times per week (e.g., Mon & Thu)",
        collection_frequency="weekly",
        
        preparation_steps=[
            PreparationStep(
                japanese="生ごみの水分をよく切る",
                english="Drain water from food waste well"
            ),
            PreparationStep(
                japanese="指定のごみ袋に入れる",
                english="Use designated garbage bags"
            ),
            PreparationStep(
                japanese="朝8時までに集積所に出す",
                english="Place at collection point by 8 AM"
            ),
            PreparationStep(
                japanese="前日の夜には出さない",
                english="Don't put out the night before"
            )
        ],
        
        notes_ja=[
            "⚠️ 油は固めるか新聞紙に吸わせる",
            "⚠️ 生ごみは新聞紙に包むと臭い防止",
            "⚠️ 汚れたプラスチックはここへ"
        ],
        notes_en=[
            "⚠️ Solidify or absorb oil with newspaper",
            "⚠️ Wrap food waste in newspaper to reduce odor",
            "⚠️ Dirty plastic that can't be cleaned goes here"
        ],
        
        color="#E74C3C",
        icon="🍎"
    ),
    
    "paper": GarbageCategory(
        category_id="paper",
        japanese_name="紙類・資源ごみ",
        hiragana="かみるい・しげんごみ",
        english_name="Paper & Recyclables",
        
        description_ja="新聞紙、雑誌、段ボール、紙パックなど",
        description_en="Newspapers, magazines, cardboard, paper cartons",
        
        examples_ja=[
            "新聞・チラシ",
            "雑誌・本",
            "段ボール",
            "紙パック（牛乳など）"
        ],
        examples_en=[
            "Newspapers, flyers",
            "Magazines, books",
            "Cardboard boxes",
            "Paper cartons (milk, etc.)"
        ],
        
        collection_day_ja="週1回（金曜日など）",
        collection_day_en="Once a week (e.g., Friday)",
        collection_frequency="weekly",
        
        preparation_steps=[
            PreparationStep(
                japanese="種類ごとに分けて紐で縛る",
                english="Sort by type and tie with string"
            ),
            PreparationStep(
                japanese="雨の日はビニールをかけて出す",
                english="Cover with plastic on rainy days"
            ),
            PreparationStep(
                japanese="紙パックは洗って開いて乾かす",
                english="Wash, open, and dry paper cartons"
            ),
            PreparationStep(
                japanese="ホチキスやクリップは外す",
                english="Remove staples and clips"
            )
        ],
        
        notes_ja=[
            "⚠️ 油がついた紙は「燃えるごみ」",
            "⚠️ ビニールコートされた紙は「燃えるごみ」",
            "⚠️ 感熱紙・写真は「燃えるごみ」"
        ],
        notes_en=[
            "⚠️ Greasy paper → burnable waste",
            "⚠️ Vinyl-coated paper → burnable waste",
            "⚠️ Thermal paper, photos → burnable waste"
        ],
        
        color="#F39C12",
        icon="📄"
    ),
    
    "plastic": GarbageCategory(
        category_id="plastic",
        japanese_name="プラスチック製容器包装",
        hiragana="ぷらすちっくせいようきほうそう",
        english_name="Plastic Containers & Packaging",
        
        description_ja="プラマークのついた容器・包装",
        description_en="Plastic containers and packaging with recycling mark",
        
        examples_ja=[
            "ペットボトル",
            "プラスチック容器",
            "レジ袋・ラップ",
            "発泡スチロール・トレイ"
        ],
        examples_en=[
            "PET bottles",
            "Plastic containers",
            "Shopping bags, plastic wrap",
            "Styrofoam, trays"
        ],
        
        collection_day_ja="週1回（火曜日など）",
        collection_day_en="Once a week (e.g., Tuesday)",
        collection_frequency="weekly",
        
        preparation_steps=[
            PreparationStep(
                japanese="中身を空にして水ですすぐ",
                english="Empty and rinse with water"
            ),
            PreparationStep(
                japanese="ラベルとキャップを外す",
                english="Remove labels and caps"
            ),
            PreparationStep(
                japanese="潰して小さくする",
                english="Crush to reduce volume"
            ),
            PreparationStep(
                japanese="汚れが落ちない場合は「燃えるごみ」",
                english="If can't clean → burnable waste"
            )
        ],
        
        notes_ja=[
            "⚠️ プラマークがない場合は「燃えるごみ」",
            "⚠️ 汚れたままだと「燃えるごみ」",
            "⚠️ ペットボトルは別回収の区もある"
        ],
        notes_en=[
            "⚠️ No recycling mark → burnable waste",
            "⚠️ If dirty → burnable waste",
            "⚠️ Some wards collect PET bottles separately"
        ],
        
        color="#2ECC71",
        icon="🧴"
    )
}


def get_garbage_rule(category_id: str, language: str = "both") -> dict:
    """
    Get garbage rule for specific category
    
    Args:
        category_id: glass, metal, organic, paper, plastic
        language: "ja", "en", or "both"
    
    Returns:
        Dictionary with garbage rules
    """
    if category_id not in GARBAGE_RULES:
        raise ValueError(f"Invalid category: {category_id}")
    
    rule = GARBAGE_RULES[category_id]
    
    if language == "ja":
        return {
            "category": rule.japanese_name,
            "description": rule.description_ja,
            "examples": rule.examples_ja,
            "collection_day": rule.collection_day_ja,
            "preparation_steps": [step.japanese for step in rule.preparation_steps],
            "notes": rule.notes_ja,
            "color": rule.color,
            "icon": rule.icon
        }
    elif language == "en":
        return {
            "category": rule.english_name,
            "description": rule.description_en,
            "examples": rule.examples_en,
            "collection_day": rule.collection_day_en,
            "preparation_steps": [step.english for step in rule.preparation_steps],
            "notes": rule.notes_en,
            "color": rule.color,
            "icon": rule.icon
        }
    else:  # both
        return rule.dict()
