namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Loves : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Loves",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Chance_Id = c.Long(),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Chances", t => t.Chance_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.Chance_Id)
                .Index(t => t.User_Id);
            
            AddColumn("dbo.AspNetUsers", "AtHandle", c => c.String());
        }
        
        public override void Down()
        {
            DropIndex("dbo.Loves", new[] { "User_Id" });
            DropIndex("dbo.Loves", new[] { "Chance_Id" });
            DropPrimaryKey("dbo.Tags");
            DropPrimaryKey("dbo.Payments");
            DropColumn("dbo.AspNetUsers", "AtHandle");
            DropTable("dbo.Loves");
        }
    }
}
