namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Hero_Props : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Title", c => c.String());
            AddColumn("dbo.AspNetUsers", "Mission", c => c.String());
            AddColumn("dbo.AspNetUsers", "PageUri", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "PageUri");
            DropColumn("dbo.AspNetUsers", "Mission");
            DropColumn("dbo.AspNetUsers", "Title");
        }
    }
}
