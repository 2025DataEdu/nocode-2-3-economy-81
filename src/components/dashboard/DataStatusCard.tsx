import { Download, Database, FileText, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DataInfo {
  name: string;
  description: string;
  tables: number;
  period: string;
  downloadUrl?: string;
}

const dataList: DataInfo[] = [
  {
    name: "고용 현황 데이터",
    description: "청년층 고용률 및 실업률 월별 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "임금 분포 데이터", 
    description: "청년층 임금 구간별 분포 현황",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "실업 기간 데이터",
    description: "청년층 실업 지속 기간별 통계",
    tables: 1,
    period: "2004.05~현재", 
    downloadUrl: "#"
  },
  {
    name: "졸업소요기간 데이터",
    description: "성별 대학 졸업소요기간 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "기타 경제활동 데이터",
    description: "추가 경제활동 관련 통계 테이블",
    tables: 17,
    period: "2004.05~현재",
    downloadUrl: "#"
  }
];

const DataStatusCard = () => {
  const handleDownload = (dataName: string, downloadUrl?: string) => {
    if (!downloadUrl || downloadUrl === "#") {
      // 실제 다운로드 로직이 구현되지 않은 경우
      alert(`${dataName} 다운로드 기능은 준비 중입니다.`);
      return;
    }
    
    // 실제 다운로드 로직
    window.open(downloadUrl, '_blank');
  };

  const totalTables = dataList.reduce((sum, item) => sum + item.tables, 0);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          사용 데이터 현황
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          현재 대시보드에서 활용 중인 데이터셋 정보 및 다운로드
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 요약 정보 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">총 테이블</span>
            </div>
            <span className="text-2xl font-bold text-primary">{totalTables}개</span>
          </div>
          
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">분석 기간</span>
            </div>
            <span className="text-lg font-bold text-primary">2004.05~현재</span>
          </div>
          
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">대상 연령</span>
            </div>
            <span className="text-lg font-bold text-primary">청년층</span>
          </div>
        </div>

        <Separator />

        {/* 데이터 리스트 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground mb-3">데이터셋 목록</h4>
          {dataList.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-background/70 rounded-lg border border-border/50 hover:bg-background/90 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h5 className="font-medium text-foreground">{data.name}</h5>
                  <Badge variant="secondary" className="text-xs">
                    {data.tables}개 테이블
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{data.description}</p>
                <p className="text-xs text-muted-foreground">기간: {data.period}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(data.name, data.downloadUrl)}
                className="ml-4 hover:bg-primary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataStatusCard;