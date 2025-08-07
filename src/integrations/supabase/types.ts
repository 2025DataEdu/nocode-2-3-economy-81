export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      성별_미취업기간별_미취업자: {
        Row: {
          "1~2년 미만": number | null
          "2~3년 미만": number | null
          "3년 이상": number | null
          "6개월 미만": number | null
          "6개월~1년 미만": number | null
          계: number | null
          성별: string | null
          시점: number | null
          연령별: string | null
        }
        Insert: {
          "1~2년 미만"?: number | null
          "2~3년 미만"?: number | null
          "3년 이상"?: number | null
          "6개월 미만"?: number | null
          "6개월~1년 미만"?: number | null
          계?: number | null
          성별?: string | null
          시점?: number | null
          연령별?: string | null
        }
        Update: {
          "1~2년 미만"?: number | null
          "2~3년 미만"?: number | null
          "3년 이상"?: number | null
          "6개월 미만"?: number | null
          "6개월~1년 미만"?: number | null
          계?: number | null
          성별?: string | null
          시점?: number | null
          연령별?: string | null
        }
        Relationships: []
      }
      성별_미취업기간활동별_미취업자: {
        Row: {
          계: number | null
          구직활동: number | null
          그냥시간보냄: number | null
          "기타(~2023.5)": string | null
          "기타(2024.5~)": string | null
          성별: string | null
          시점: number | null
          여가시간: number | null
          연령별: string | null
          육아가사: number | null
          직업교육훈련: number | null
          "진학준비(2024.5~)": string | null
          취업관련시험준비: number | null
        }
        Insert: {
          계?: number | null
          구직활동?: number | null
          그냥시간보냄?: number | null
          "기타(~2023.5)"?: string | null
          "기타(2024.5~)"?: string | null
          성별?: string | null
          시점?: number | null
          여가시간?: number | null
          연령별?: string | null
          육아가사?: number | null
          직업교육훈련?: number | null
          "진학준비(2024.5~)"?: string | null
          취업관련시험준비?: number | null
        }
        Update: {
          계?: number | null
          구직활동?: number | null
          그냥시간보냄?: number | null
          "기타(~2023.5)"?: string | null
          "기타(2024.5~)"?: string | null
          성별?: string | null
          시점?: number | null
          여가시간?: number | null
          연령별?: string | null
          육아가사?: number | null
          직업교육훈련?: number | null
          "진학준비(2024.5~)"?: string | null
          취업관련시험준비?: number | null
        }
        Relationships: []
      }
      성별_첫_일자리_월평균임금: {
        Row: {
          "100~150만원 미만": number | null
          "150~200만원 미만": number | null
          "200~300만원 미만": number | null
          "300만원 이상": number | null
          "50~100만원 미만": number | null
          "50만원 미만": number | null
          계: number | null
          성별: string | null
          시점: number | null
          연령구분: string | null
        }
        Insert: {
          "100~150만원 미만"?: number | null
          "150~200만원 미만"?: number | null
          "200~300만원 미만"?: number | null
          "300만원 이상"?: number | null
          "50~100만원 미만"?: number | null
          "50만원 미만"?: number | null
          계?: number | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
        }
        Update: {
          "100~150만원 미만"?: number | null
          "150~200만원 미만"?: number | null
          "200~300만원 미만"?: number | null
          "300만원 이상"?: number | null
          "50~100만원 미만"?: number | null
          "50만원 미만"?: number | null
          계?: number | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
        }
        Relationships: []
      }
      성별_첫일자리를_그만둔_사유: {
        Row: {
          "개인/가족적이유(건강육아결혼등)": number | null
          "그 외": number | null
          "근로여건 불만족(보수 근로시간 등)": number | null
          성별: string | null
          시점: number | null
          연령구분: string | null
          "이직 경험자 전체": number | null
          "임시적 계절적인 일의 완료 계약기간 끝남": number | null
          "전공 지식 기술 적성등이 맞지않아서": number | null
          "전망이 없어서": number | null
          "직장휴업 폐업 파산 등": number | null
        }
        Insert: {
          "개인/가족적이유(건강육아결혼등)"?: number | null
          "그 외"?: number | null
          "근로여건 불만족(보수 근로시간 등)"?: number | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
          "이직 경험자 전체"?: number | null
          "임시적 계절적인 일의 완료 계약기간 끝남"?: number | null
          "전공 지식 기술 적성등이 맞지않아서"?: number | null
          "전망이 없어서"?: number | null
          "직장휴업 폐업 파산 등"?: number | null
        }
        Update: {
          "개인/가족적이유(건강육아결혼등)"?: number | null
          "그 외"?: number | null
          "근로여건 불만족(보수 근로시간 등)"?: number | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
          "이직 경험자 전체"?: number | null
          "임시적 계절적인 일의 완료 계약기간 끝남"?: number | null
          "전공 지식 기술 적성등이 맞지않아서"?: number | null
          "전망이 없어서"?: number | null
          "직장휴업 폐업 파산 등"?: number | null
        }
        Relationships: []
      }
      성별_최종학교_전공일치_여부: {
        Row: {
          계: number | null
          "그런대로 일치": number | null
          "매우 불일치": number | null
          "매우 일치": number | null
          성별: string | null
          시점: number | null
          "약간 불일치": number | null
          연령별: string | null
        }
        Insert: {
          계?: number | null
          "그런대로 일치"?: number | null
          "매우 불일치"?: number | null
          "매우 일치"?: number | null
          성별?: string | null
          시점?: number | null
          "약간 불일치"?: number | null
          연령별?: string | null
        }
        Update: {
          계?: number | null
          "그런대로 일치"?: number | null
          "매우 불일치"?: number | null
          "매우 일치"?: number | null
          성별?: string | null
          시점?: number | null
          "약간 불일치"?: number | null
          연령별?: string | null
        }
        Relationships: []
      }
      성별_취업시험준비유무_및_준비분야_비경제활: {
        Row: {
          "- 고시 및 전문직": number | null
          "- 교원임용": number | null
          "- 기능분야 및 기타": number | null
          "- 언론사/공영기업체": number | null
          "- 일반기업체": number | null
          "- 일반직공무원": number | null
          미상: string | null
          성별: string | null
          시점: number | null
          연령구분: string | null
          "청년층 비경제활동인구 전체": number | null
          "취업시험 준비하였음": number | null
          "취업시험 준비하지 않았음": number | null
        }
        Insert: {
          "- 고시 및 전문직"?: number | null
          "- 교원임용"?: number | null
          "- 기능분야 및 기타"?: number | null
          "- 언론사/공영기업체"?: number | null
          "- 일반기업체"?: number | null
          "- 일반직공무원"?: number | null
          미상?: string | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
          "청년층 비경제활동인구 전체"?: number | null
          "취업시험 준비하였음"?: number | null
          "취업시험 준비하지 않았음"?: number | null
        }
        Update: {
          "- 고시 및 전문직"?: number | null
          "- 교원임용"?: number | null
          "- 기능분야 및 기타"?: number | null
          "- 언론사/공영기업체"?: number | null
          "- 일반기업체"?: number | null
          "- 일반직공무원"?: number | null
          미상?: string | null
          성별?: string | null
          시점?: number | null
          연령구분?: string | null
          "청년층 비경제활동인구 전체"?: number | null
          "취업시험 준비하였음"?: number | null
          "취업시험 준비하지 않았음"?: number | null
        }
        Relationships: []
      }
      연령별_경제활동상태: {
        Row: {
          경제활동인구: string | null
          고용률: string | null
          비경제활동인구: string | null
          수학여부: string | null
          시점: number | null
          실업률: string | null
          실업자: string | null
          연령별: string | null
          청년층인구: string | null
          취업자: string | null
        }
        Insert: {
          경제활동인구?: string | null
          고용률?: string | null
          비경제활동인구?: string | null
          수학여부?: string | null
          시점?: number | null
          실업률?: string | null
          실업자?: string | null
          연령별?: string | null
          청년층인구?: string | null
          취업자?: string | null
        }
        Update: {
          경제활동인구?: string | null
          고용률?: string | null
          비경제활동인구?: string | null
          수학여부?: string | null
          시점?: number | null
          실업률?: string | null
          실업자?: string | null
          연령별?: string | null
          청년층인구?: string | null
          취업자?: string | null
        }
        Relationships: []
      }
      연령별_수학여부: {
        Row: {
          무학: string | null
          시점: number | null
          연령별: string | null
          재학: number | null
          "졸업/중퇴": number | null
          "청년층인구 전체": number | null
          휴학: number | null
        }
        Insert: {
          무학?: string | null
          시점?: number | null
          연령별?: string | null
          재학?: number | null
          "졸업/중퇴"?: number | null
          "청년층인구 전체"?: number | null
          휴학?: number | null
        }
        Update: {
          무학?: string | null
          시점?: number | null
          연령별?: string | null
          재학?: number | null
          "졸업/중퇴"?: number | null
          "청년층인구 전체"?: number | null
          휴학?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
