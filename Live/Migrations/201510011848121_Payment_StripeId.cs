namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Payment_StripeId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Payments", "StripeId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Payments", "StripeId");
        }
    }
}
