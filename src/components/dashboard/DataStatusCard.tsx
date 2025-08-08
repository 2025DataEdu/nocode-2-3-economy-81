import { Download, Database, FileText, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DataInfo {
  name: string;
  description: string;
  tables: number;
  period: string;
  tableName: string; // Supabase 테이블명 추가
  downloadUrl?: string;
}

const dataList: DataInfo[] = [
  {
    name: "연령별 경제활동상태",
    description: "청년층 고용률 및 실업률 월별 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "연령별_경제활동상태",
    downloadUrl: "#"
  },
  {
    name: "성별 첫 일자리 월평균임금", 
    description: "청년층 임금 구간별 분포 현황",
    tables: 1,
    period: "2017.05~현재",
    tableName: "성별_첫_일자리_월평균임금",
    downloadUrl: "#"
  },
  {
    name: "성별 미취업기간별 미취업자",
    description: "청년층 실업 지속 기간별 통계",
    tables: 1,
    period: "2007.05~현재",
    tableName: "성별_미취업기간별_미취업자", 
    downloadUrl: "#"
  },
  {
    name: "성 및 학제별 대학졸업소요기간",
    description: "성별 대학 졸업소요기간 통계",
    tables: 1,
    period: "2007.05~현재",
    tableName: "성_및_학제별_대학졸업소요기간",
    downloadUrl: "#"
  },
  {
    name: "성별 미취업기간활동별 미취업자",
    description: "미취업 중 활동 유형별 통계",
    tables: 1,
    period: "2008.05~현재",
    tableName: "성별_미취업기간활동별_미취업자",
    downloadUrl: "#"
  },
  {
    name: "성별 직업교육 훈련 경험 유무 및 시기",
    description: "직업교육 훈련 경험 현황",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_직업교육_훈련__경험_유무_및_시기",
    downloadUrl: "#"
  },
  {
    name: "성별 직업교육 훈련을 받은 직업훈련유경험자",
    description: "직업훈련 기관별 경험자 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_직업교육_훈련_을_받은_직업훈련유경험자",
    downloadUrl: "#"
  },
  {
    name: "성별 직장체험유무 및 기간",
    description: "직장체험 경험 및 기간별 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_직장체험유무_및_기간",
    downloadUrl: "#"
  },
  {
    name: "성별 직장체험형태 직장체험경험자",
    description: "직장체험 형태별 경험자 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_직장체험형태_직장체험경험자",
    downloadUrl: "#"
  },
  {
    name: "성별 첫 취업 소요기간 및 평균소요기간",
    description: "첫 취업까지 소요 기간 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_첫_취업_소요기간_및_평균소요기간",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리 산업 졸업 중퇴 취업유경험자",
    description: "첫 일자리 산업분야별 분포",
    tables: 1,
    period: "2013.05~현재",
    tableName: "성별_첫일자리_산업_졸업_중퇴_취업유경험자",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리 직업 졸업 중퇴취업유경험자",
    description: "첫 일자리 직업분야별 분포",
    tables: 1,
    period: "2013.05~현재",
    tableName: "성별_첫일자리_직업_졸업_중퇴취업유경험자",
    downloadUrl: "#"
  },
  {
    name: "성별 첫일자리를 그만둔 사유",
    description: "첫 일자리 퇴사 사유별 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_첫일자리를_그만둔_사유",
    downloadUrl: "#"
  },
  {
    name: "성별 최종학교 전공일치 여부",
    description: "최종학교 전공과 직무 일치도",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_최종학교_전공일치_여부",
    downloadUrl: "#"
  },
  {
    name: "성별 취업경험유무 및 횟수 졸업 중퇴 인구",
    description: "취업 경험 횟수별 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_취업경험유무_및_횟수_졸업_중퇴_인구",
    downloadUrl: "#"
  },
  {
    name: "성별 취업시험준비유무 및 준비분야 비경제활",
    description: "취업시험 준비 분야별 통계",
    tables: 1,
    period: "2006.05~현재",
    tableName: "성별_취업시험준비유무_및_준비분야_비경제활",
    downloadUrl: "#"
  },
  {
    name: "성별 학력별 취업경로 졸업 중퇴 취업자",
    description: "학력별 취업 경로 분석",
    tables: 1,
    period: "2004.05~현재",
    tableName: "성별_학력별_취업경로__졸업_중퇴_취업자",
    downloadUrl: "#"
  },
  {
    name: "성별 휴학경험유무 평균휴학기간 대졸자",
    description: "대졸자 휴학 경험 및 기간",
    tables: 1,
    period: "2007.05~현재",
    tableName: "성별_휴학경험유무_평균휴학기간_대졸자",
    downloadUrl: "#"
  },
  {
    name: "연령별 수학여부",
    description: "연령별 재학/졸업 상태 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "연령별_수학여부",
    downloadUrl: "#"
  },
  {
    name: "졸업 중퇴 취업자의 산업별 취업분포 11차",
    description: "산업분류별 취업자 분포",
    tables: 1,
    period: "2013.05~현재",
    tableName: "졸업_중퇴_취업자의_산업별_취업분포_11차",
    downloadUrl: "#"
  },
  {
    name: "첫직장 근속기간",
    description: "첫 직장 평균 근속기간 통계",
    tables: 1,
    period: "2004.05~현재",
    tableName: "첫직장_근속기간",
    downloadUrl: "#"
  }
];

const DataStatusCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const convertToCSV = (data: any[], tableName: string) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // 값에 쉼표나 따옴표가 있으면 따옴표로 감싸기
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };
  
  const downloadDataset = async (dataName: string, tableName: string) => {
    try {
      toast({
        title: "다운로드 시작",
        description: `${dataName} 데이터를 가져오는 중...`,
      });

      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .order('시점', { ascending: true });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          title: "데이터 없음",
          description: "해당 테이블에 데이터가 없습니다.",
          variant: "destructive",
        });
        return;
      }

      const csvContent = convertToCSV(data, tableName);
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${tableName}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "다운로드 완료",
        description: `${dataName} 데이터가 CSV 형식으로 다운로드되었습니다.`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "다운로드 실패",
        description: "데이터 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const totalTables = dataList.reduce((sum, item) => sum + item.tables, 0);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center">
            <Database className="w-4 h-4 text-primary" />
          </div>
          사용 데이터 현황
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          현재 대시보드에서 활용 중인 데이터셋 정보 및 다운로드
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 요약 정보 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">총 테이블</span>
            </div>
            <span className="text-xl font-bold text-primary">{totalTables}개</span>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">분석 기간</span>
            </div>
            <span className="text-base font-bold text-primary">2004.05~현재</span>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">대상 연령</span>
            </div>
            <span className="text-base font-bold text-primary">청년층</span>
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
          
          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-60 w-full">
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
                      onClick={() => downloadDataset(data.name, data.tableName)}
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