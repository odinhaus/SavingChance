namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Default_AnimalType : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ViewFilters",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        AnimalTypes = c.Int(nullable: false),
                        IsDefault = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Chances", "AnimalType", c => c.Int(nullable: false));
            AddColumn("dbo.AspNetUsers", "ViewFilter_Id", c => c.Long());
            CreateIndex("dbo.AspNetUsers", "ViewFilter_Id");
            AddForeignKey("dbo.AspNetUsers", "ViewFilter_Id", "dbo.ViewFilters", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "ViewFilter_Id", "dbo.ViewFilters");
            DropIndex("dbo.AspNetUsers", new[] { "ViewFilter_Id" });
            DropColumn("dbo.AspNetUsers", "ViewFilter_Id");
            DropColumn("dbo.Chances", "AnimalType");
            DropTable("dbo.ViewFilters");
        }
    }
}
