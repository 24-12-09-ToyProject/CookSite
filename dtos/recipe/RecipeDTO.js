class RecipeDTO {
    constructor({ RECIPE_TITLE, MEMBER_ID, RECIPE_THUMBNAIL}) {
        this.member_id = MEMBER_ID;
        this.title = RECIPE_TITLE;
        this.thumbnail = RECIPE_THUMBNAIL;
    }
}

module.exports = RecipeDTO;