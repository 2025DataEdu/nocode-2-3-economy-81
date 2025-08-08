import { Download, Database, FileText, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface DataInfo {
  name: string;
  description: string;
  tables: number;
  period: string;
  downloadUrl?: string;
}

const dataList: DataInfo[] = [
  {
    name: "연령별 경제활동상태",
    description: "청년층 고용률 및 실업률 월별 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 첫 일자리 월평균임금", 
    description: "청년층 임금 구간별 분포 현황",
    tables: 1,
    period: "2017.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 미취업기간별 미취업자",
    description: "청년층 실업 지속 기간별 통계",
    tables: 1,
    period: "2007.05~현재", 
    downloadUrl: "#"
  },
  {
    name: "성 및 학제별 대학졸업소요기간",
    description: "성별 대학 졸업소요기간 통계",
    tables: 1,
    period: "2007.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 미취업기간활동별 미취업자",
    description: "미취업 중 활동 유형별 통계",
    tables: 1,
    period: "2008.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 직업교육 훈련 경험 유무 및 시기",
    description: "직업교육 훈련 경험 현황",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 직업교육 훈련을 받은 직업훈련유경험자",
    description: "직업훈련 기관별 경험자 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 직장체험유무 및 기간",
    description: "직장체험 경험 및 기간별 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 직장체험형태 직장체험경험자",
    description: "직장체험 형태별 경험자 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 첫 취업 소요기간 및 평균소요기간",
    description: "첫 취업까지 소요 기간 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리 산업 졸업 중퇴 취업유경험자",
    description: "첫 일자리 산업분야별 분포",
    tables: 1,
    period: "2013.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리 직업 졸업 중퇴취업유경험자",
    description: "첫 일자리 직업분야별 분포",
    tables: 1,
    period: "2013.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리를 그만둔 사유",
    description: "첫 일자리 퇴사 사유별 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 최종학교 전공일치 여부",
    description: "최종학교 전공과 직무 일치도",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 취업경험유무 및 횟수 졸업 중퇴 인구",
    description: "취업 경험 횟수별 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 취업시험준비유무 및 준비분야 비경제활",
    description: "취업시험 준비 분야별 통계",
    tables: 1,
    period: "2006.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 학력별 취업경로 졸업 중퇴 취업자",
    description: "학력별 취업 경로 분석",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "성별 휴학경험유무 평균휴학기간 대졸자",
    description: "대졸자 휴학 경험 및 기간",
    tables: 1,
    period: "2007.05~현재",
    downloadUrl: "#"
  },
  {
    name: "연령별 수학여부",
    description: "연령별 재학/졸업 상태 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  },
  {
    name: "졸업 중퇴 취업자의 산업별 취업분포 11차",
    description: "산업분류별 취업자 분포",
    tables: 1,
    period: "2013.05~현재",
    downloadUrl: "#"
  },
  {
    name: "첫직장 근속기간",
    description: "첫 직장 평균 근속기간 통계",
    tables: 1,
    period: "2004.05~현재",
    downloadUrl: "#"
  }
];

const DataStatusCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-0 h-auto hover:bg-transparent"
            >
              <h4 className="text-sm font-semibold text-foreground">
                데이터셋 목록 ({dataList.length}개)
              </h4>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <ScrollArea className="h-80 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                {dataList.map((data, index) => (
                  <div key={index} className="flex flex-col p-3 bg-background/70 rounded-lg border border-border/50 hover:bg-background/90 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-foreground text-sm truncate">{data.name}</h5>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {data.tables}개
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{data.description}</p>
                        <p className="text-xs text-muted-foreground">기간: {data.period}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(data.name, data.downloadUrl)}
                      className="mt-2 self-start hover:bg-primary/10 text-xs h-7"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DataStatusCard;