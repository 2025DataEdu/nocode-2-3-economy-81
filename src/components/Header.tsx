import { BarChart3, Briefcase, Users, GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-card border-0 shadow-purple backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-purple">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                청년 경제활동 현황 분석
              </h1>
              <p className="text-muted-foreground text-sm font-medium">Youth Employment Status Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">데이터 분석</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-accent/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">청년층(20~34세) 대상</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;