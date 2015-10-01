namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AtHandle_Unique : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "AtHandle", c => c.String(maxLength: 64, unicode: false));
            CreateIndex("dbo.AspNetUsers", "AtHandle", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.AspNetUsers", new[] { "AtHandle" });
            AlterColumn("dbo.AspNetUsers", "AtHandle", c => c.String());
        }
    }
}
