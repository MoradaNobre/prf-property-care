export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          contact_person: string | null
          created_at: string
          email: string | null
          id: number
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          company_id: number | null
          completion_date: string | null
          cost: number | null
          created_at: string
          description: string
          id: number
          property_id: number
          request_date: string
          status: Database["public"]["Enums"]["maintenance_status_enum"]
          updated_at: string
        }
        Insert: {
          company_id?: number | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: number
          property_id: number
          request_date?: string
          status?: Database["public"]["Enums"]["maintenance_status_enum"]
          updated_at?: string
        }
        Update: {
          company_id?: number | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: number
          property_id?: number
          request_date?: string
          status?: Database["public"]["Enums"]["maintenance_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id_caip"]
          },
        ]
      }
      properties: {
        Row: {
          area_cobertura_fiscalizacao_m2: number | null
          area_cobertura_pista_m2: number | null
          area_construida_m2: number | null
          area_patio_retencao_m2: number | null
          area_terreno_m2: number | null
          coordenadas: string | null
          created_at: string
          endereco: string
          estado_conservacao:
            | Database["public"]["Enums"]["conservation_status_enum"]
            | null
          id_caip: number
          nome_unidade: string
          situacao: Database["public"]["Enums"]["property_situation_enum"]
          tipo_imovel: Database["public"]["Enums"]["property_type_enum"]
          unidade_gestora: string
          updated_at: string
          vida_util_estimada: number | null
        }
        Insert: {
          area_cobertura_fiscalizacao_m2?: number | null
          area_cobertura_pista_m2?: number | null
          area_construida_m2?: number | null
          area_patio_retencao_m2?: number | null
          area_terreno_m2?: number | null
          coordenadas?: string | null
          created_at?: string
          endereco: string
          estado_conservacao?:
            | Database["public"]["Enums"]["conservation_status_enum"]
            | null
          id_caip: number
          nome_unidade: string
          situacao: Database["public"]["Enums"]["property_situation_enum"]
          tipo_imovel: Database["public"]["Enums"]["property_type_enum"]
          unidade_gestora: string
          updated_at?: string
          vida_util_estimada?: number | null
        }
        Update: {
          area_cobertura_fiscalizacao_m2?: number | null
          area_cobertura_pista_m2?: number | null
          area_construida_m2?: number | null
          area_patio_retencao_m2?: number | null
          area_terreno_m2?: number | null
          coordenadas?: string | null
          created_at?: string
          endereco?: string
          estado_conservacao?:
            | Database["public"]["Enums"]["conservation_status_enum"]
            | null
          id_caip?: number
          nome_unidade?: string
          situacao?: Database["public"]["Enums"]["property_situation_enum"]
          tipo_imovel?: Database["public"]["Enums"]["property_type_enum"]
          unidade_gestora?: string
          updated_at?: string
          vida_util_estimada?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: number
          password_hash: string
          role: Database["public"]["Enums"]["user_role_enum"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          password_hash: string
          role: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string
          username?: string
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
      conservation_status_enum: "otimo" | "bom" | "regular" | "ruim" | "critico"
      maintenance_status_enum: "solicitado" | "em_andamento" | "concluido"
      property_situation_enum: "ativo" | "inativo" | "em_reforma"
      property_type_enum: "posto_policial" | "unidade_administrativa" | "outros"
      user_role_enum:
        | "admin_prf"
        | "user_prf"
        | "company_admin"
        | "company_user"
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
    Enums: {
      conservation_status_enum: ["otimo", "bom", "regular", "ruim", "critico"],
      maintenance_status_enum: ["solicitado", "em_andamento", "concluido"],
      property_situation_enum: ["ativo", "inativo", "em_reforma"],
      property_type_enum: [
        "posto_policial",
        "unidade_administrativa",
        "outros",
      ],
      user_role_enum: [
        "admin_prf",
        "user_prf",
        "company_admin",
        "company_user",
      ],
    },
  },
} as const
