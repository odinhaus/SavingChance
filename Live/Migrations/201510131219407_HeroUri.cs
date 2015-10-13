namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HeroUri : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "HeroUri", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "HeroUri");
        }
    }
}
