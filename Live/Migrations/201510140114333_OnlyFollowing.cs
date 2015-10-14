namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OnlyFollowing : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ViewFilters", "OnlyFollowing", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ViewFilters", "OnlyFollowing");
        }
    }
}
