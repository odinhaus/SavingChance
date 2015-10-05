namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ViewFilter_Index : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.ViewFilters", "AnimalTypes");
        }
        
        public override void Down()
        {
            DropIndex("dbo.ViewFilters", new[] { "AnimalTypes" });
        }
    }
}
