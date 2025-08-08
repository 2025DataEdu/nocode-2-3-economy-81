import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb, Database, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sources?: string[];
  dataPoints?: number;
}

// 예시 질문들
const EXAMPLE_QUESTIONS = [
  "현재 청년층 고용률과 실업률은 어떻게 되나요?",
  "청년층 첫 일자리 평균 임금은 얼마인가요?",
  "졸업 후 첫 취업까지 평균 얼마나 걸리나요?",
  "미취업 기간이 긴 청년들의 비율은 어떻게 되나요?",
  "청년 고용률이 가장 높았던 시기는 언제인가요?",
  "300만원 이상 고임금을 받는 청년 비율은?",
  "최근 3년간 청년 고용 상황의 변화는?",
  "청년 실업자 수는 얼마나 되나요?",
  "6개월 이상 미취업 상태인 청년 비율은?",
  "청년층 경제활동 참가율은 어떻게 되나요?",
  "첫 일자리에서 300만원 이상 받는 청년 비율은?",
  "청년 고용률과 실업률의 최근 트렌드는?"
];

const YouthEmploymentChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '안녕하세요! 저는 청년층(20~34세) 고용 데이터 전문 챗봇입니다. 실제 통계청 데이터를 바탕으로 정확한 정보를 제공해드립니다. 궁금한 것이 있으시면 언제든 물어보세요!',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput(""); // 직접 입력한 경우만 input 초기화
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('youth-employment-chat', {
        body: { question: textToSend }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.success ? data.answer : '죄송합니다. 오류가 발생했습니다.',
        timestamp: new Date(),
        sources: data.sources || [],
        dataPoints: data.data_used || 0
      };

      setMessages(prev => [...prev, botMessage]);

      if (!data.success) {
        toast({
          title: "오류 발생",
          description: data.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '죄송합니다. 현재 서비스에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "연결 오류",
        description: "챗봇 서비스에 연결할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const downloadChatHistory = async () => {
    try {
      // 채팅 메시지 컨테이너 찾기 (ScrollArea 안의 실제 메시지들)
      const chatContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport] > div > div');
      if (!chatContainer) {
        toast({
          title: "오류",
          description: "채팅 내용을 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      // 로딩 상태 표시
      toast({
        title: "PDF 생성 중",
        description: "전체 채팅 기록을 PDF로 변환하고 있습니다...",
      });

      // 임시로 스크롤 숨기고 전체 높이로 설정
      const originalHeight = (chatContainer as HTMLElement).style.height;
      const originalOverflow = (chatContainer as HTMLElement).style.overflow;
      
      (chatContainer as HTMLElement).style.height = 'auto';
      (chatContainer as HTMLElement).style.overflow = 'visible';

      // 약간의 딜레이로 DOM 업데이트 대기
      await new Promise(resolve => setTimeout(resolve, 100));

      // HTML을 캔버스로 변환 - 전체 컨텐츠
      const canvas = await html2canvas(chatContainer as HTMLElement, {
        scale: 2, // 고해상도
        useCORS: true,
        backgroundColor: '#ffffff',
        width: (chatContainer as HTMLElement).scrollWidth,
        height: (chatContainer as HTMLElement).scrollHeight,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // 복제된 문서에서 스크롤바 제거
          const scrollbars = clonedDoc.querySelectorAll('[data-radix-scroll-area-scrollbar]');
          scrollbars.forEach(el => el.remove());
          
          // 모든 스크롤 관련 스타일 제거
          const scrollElements = clonedDoc.querySelectorAll('[data-radix-scroll-area-viewport]');
          scrollElements.forEach(el => {
            (el as HTMLElement).style.overflow = 'visible';
            (el as HTMLElement).style.height = 'auto';
          });
        }
      });

      // 원래 스타일 복원
      (chatContainer as HTMLElement).style.height = originalHeight;
      (chatContainer as HTMLElement).style.overflow = originalOverflow;

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 제목 및 헤더 추가
      pdf.setFontSize(16);
      pdf.text('Youth Employment Chat History', 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, 20, 30);
      pdf.text(`Total Messages: ${messages.length}`, 20, 37);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 170; // 여백을 고려한 이미지 폭
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 45; // 헤더 아래부터 시작

      // 첫 번째 이미지 추가
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);

      // 필요하면 추가 페이지에 나머지 이미지 추가
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 20;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }

      // PDF 저장
      const filename = `youth-employment-chat-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

      toast({
        title: "다운로드 완료",
        description: `전체 채팅 기록 (${messages.length}개 메시지)이 PDF로 저장되었습니다.`,
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF 생성 실패",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            청년 고용 데이터 챗봇
          </CardTitle>
          <CardDescription>
            실제 통계청 데이터를 기반으로 한 RAG 시스템으로 정확한 청년 고용 정보를 제공합니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 예시 질문들 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            추천 질문
          </CardTitle>
          <CardDescription>
            아래 질문들을 클릭하거나 직접 질문을 입력해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-3 text-left justify-start whitespace-normal"
                onClick={() => handleExampleClick(question)}
              >
                <span className="text-xs">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 채팅 영역 */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">대화</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadChatHistory}
              disabled={messages.length <= 1}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <div className="flex items-center gap-1 mb-1">
                            <Database className="w-3 h-3" />
                            <span className="text-xs font-medium">데이터 출처:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                          {message.dataPoints && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {message.dataPoints}개 데이터 포인트 활용
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 입력 영역 */}
          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="청년 고용에 관해 궁금한 것을 물어보세요..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouthEmploymentChatbot;