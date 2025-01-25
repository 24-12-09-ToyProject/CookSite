class RecipeDTO {
    constructor({ RECIPE_NO, RECIPE_TITLE, MEMBER_ID, RECIPE_THUMBNAIL}) {
        this.recipe_no = RECIPE_NO;
        this.member_id = MEMBER_ID;
        this.title = RECIPE_TITLE;
        this.thumbnail = RECIPE_THUMBNAIL;
    }
}

module.exports = RecipeDTO;