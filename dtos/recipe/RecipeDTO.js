class RecipeDTO {
    constructor(row) {
        this.recipe_no = row.RECIPE_NO;
        this.member_id = row.MEMBER_ID;
        this.title = row.RECIPE_TITLE;
        this.thumbnail = row.RECIPE_THUMBNAIL;
        this.profileImg = row.FILE_RENAME || '';
    }
}

module.exports = RecipeDTO;