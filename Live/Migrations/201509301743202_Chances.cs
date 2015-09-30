namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Chances : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Chances",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ExpirationType = c.Int(nullable: false),
                        SaveType = c.Int(nullable: false),
                        Title = c.String(),
                        Goal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Total = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Started = c.DateTime(nullable: false),
                        Expires = c.DateTime(nullable: false),
                        Sponsor_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.Sponsor_Id)
                .Index(t => t.Sponsor_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Chances", "Sponsor_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Chances", new[] { "Sponsor_Id" });
            DropTable("dbo.Chances");
        }
    }
}
