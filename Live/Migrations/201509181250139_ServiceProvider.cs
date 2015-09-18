namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ServiceProvider : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "ServiceProviderType", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "ServiceProviderType");
        }
    }
}
