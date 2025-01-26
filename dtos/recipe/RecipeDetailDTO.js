class RecipeDetailDTO {
    constructor({ RECIPE_NO, RECIPE_TITLE, MEMBER_ID, RECIPE_THUMBNAIL, 
        RECIPE_INTRO, RECIPE_CATEGORY, RECIPE_DIFFICULTY, SERVING, INGREDIENTS }) {
        this.recipe_no = RECIPE_NO;
        this.member_id = MEMBER_ID;
        this.title = RECIPE_TITLE;
        this.thumbnail = RECIPE_THUMBNAIL;
        this.intro = RECIPE_INTRO;
        this.category = RECIPE_CATEGORY;
        this.difficulty = RECIPE_DIFFICULTY;
        this.serving = SERVING;
        this.ingredients = INGREDIENTS;
        this.steps = [];
    }
    addStep({ STEP_NO, STEP, DESCRIPTION, RECIPE_IMAGE_PATH}) {
        this.steps.push({
            step_no: STEP_NO,
            step: STEP,
            description: DESCRIPTION,
            recipe_image_path: RECIPE_IMAGE_PATH
        });
    }
}

module.exports = RecipeDetailDTO;