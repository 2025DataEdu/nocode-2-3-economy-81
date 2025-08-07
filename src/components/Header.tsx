import { BarChart3, TrendingUp, Users } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">청년 경제활동 분석</h1>
              <p className="text-muted-foreground text-sm">Youth Economic Activity Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">데이터 분석</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">청년층 대상</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;