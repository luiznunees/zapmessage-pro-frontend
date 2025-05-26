export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      instagram_targets: {
        Row: {
          created_at: string | null
          followed_at: string | null
          id: string
          post_source: string
          status: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          followed_at?: string | null
          id?: string
          post_source: string
          status?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          followed_at?: string | null
          id?: string
          post_source?: string
          status?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      "Leads Frios": {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      "Leads Frios 1": {
        Row: {
          Celular: string | null
          "Fone principal": string | null
          id: number
          "Nome/Denominacao": string | null
          RemoteJid: string | null
          Status: string | null
          "Status Funil": string | null
        }
        Insert: {
          Celular?: string | null
          "Fone principal"?: string | null
          id?: number
          "Nome/Denominacao"?: string | null
          RemoteJid?: string | null
          Status?: string | null
          "Status Funil"?: string | null
        }
        Update: {
          Celular?: string | null
          "Fone principal"?: string | null
          id?: number
          "Nome/Denominacao"?: string | null
          RemoteJid?: string | null
          Status?: string | null
          "Status Funil"?: string | null
        }
        Relationships: []
      }
      "Leads que não querem receber ofertas": {
        Row: {
          created_at: string
          id: number
          Nome: string | null
          Telefone: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          Nome?: string | null
          Telefone?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          Nome?: string | null
          Telefone?: string | null
        }
        Relationships: []
      }
      "Leads TODOS JUNTOS": {
        Row: {
          Categoria: string | null
          Nome: string | null
          Obs: string | null
          RemoteJID: string | null
          Status: string | null
          "Status Funil": string | null
          "Status Mensagens": string | null
          Telefone: string
        }
        Insert: {
          Categoria?: string | null
          Nome?: string | null
          Obs?: string | null
          RemoteJID?: string | null
          Status?: string | null
          "Status Funil"?: string | null
          "Status Mensagens"?: string | null
          Telefone: string
        }
        Update: {
          Categoria?: string | null
          Nome?: string | null
          Obs?: string | null
          RemoteJID?: string | null
          Status?: string | null
          "Status Funil"?: string | null
          "Status Mensagens"?: string | null
          Telefone?: string
        }
        Relationships: []
      }
      Leads_Condominios: {
        Row: {
          Condominio: string | null
          Email: string | null
          id: number
          Status_Envio: string | null
          Telefone: string | null
          Ultimo_Envio: string | null
        }
        Insert: {
          Condominio?: string | null
          Email?: string | null
          id?: number
          Status_Envio?: string | null
          Telefone?: string | null
          Ultimo_Envio?: string | null
        }
        Update: {
          Condominio?: string | null
          Email?: string | null
          id?: number
          Status_Envio?: string | null
          Telefone?: string | null
          Ultimo_Envio?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
