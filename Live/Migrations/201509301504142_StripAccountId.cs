namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class StripAccountId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "StripeAccountId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "StripeAccountId");
        }
    }
}
