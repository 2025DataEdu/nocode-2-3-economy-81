import { BarChart3, Briefcase, Users, GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                청년 취업 현황 대시보드
              </h1>
              <p className="text-muted-foreground text-sm font-medium">Youth Employment Status Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">실시간 분석</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">청년층 대상</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;