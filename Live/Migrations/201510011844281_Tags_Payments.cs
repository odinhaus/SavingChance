namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Tags_Payments : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Payments",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PaymentType = c.Int(nullable: false),
                        Created = c.DateTime(nullable: false),
                        Payor_Id = c.String(maxLength: 128),
                        Chance_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.Payor_Id)
                .ForeignKey("dbo.Chances", t => t.Chance_Id)
                .Index(t => t.Payor_Id)
                .Index(t => t.Chance_Id);
            
            CreateTable(
                "dbo.Tags",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        Chance_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Chances", t => t.Chance_Id)
                .Index(t => t.Chance_Id);
            
            AddColumn("dbo.Chances", "Status", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tags", "Chance_Id", "dbo.Chances");
            DropForeignKey("dbo.Payments", "Chance_Id", "dbo.Chances");
            DropForeignKey("dbo.Payments", "Payor_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Tags", new[] { "Chance_Id" });
            DropIndex("dbo.Payments", new[] { "Chance_Id" });
            DropIndex("dbo.Payments", new[] { "Payor_Id" });
            DropColumn("dbo.Chances", "Status");
            DropTable("dbo.Tags");
            DropTable("dbo.Payments");
        }
    }
}
