import Link from "next/link"
import { LogOut, Home, Settings, ShoppingBag } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, User!</h1>
              <p className="text-muted-foreground">Manage your orders and account settings</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <LogOut size={20} /> Logout
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="md:col-span-3 grid sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <ShoppingBag className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Recent Orders</h3>
              <p className="text-sm text-muted-foreground">View your order history</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-accent/10 p-3 rounded-lg w-fit mb-4">
                <Home className="text-accent" size={24} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Addresses</h3>
              <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                <Settings className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">Account preferences</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Total Orders</h3>
            <p className="text-4xl font-bold text-primary">12</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Total Spent</h3>
            <p className="text-4xl font-bold text-accent">$458</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Loyalty Points</h3>
            <p className="text-4xl font-bold text-primary">1,240</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">Order #{1000 + order}</h3>
                    <p className="text-sm text-muted-foreground">Dec {20 - order}, 2024</p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
