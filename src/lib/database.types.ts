export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      farms: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          emoji: string;
          price: number;
          unit: string;
          initial_stock: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          emoji: string;
          price: number;
          unit: string;
          initial_stock?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name?: string;
          emoji?: string;
          price?: number;
          unit?: string;
          initial_stock?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_farm_id_fkey';
            columns: ['farm_id'];
            isOneToOne: false;
            referencedRelation: 'farms';
            referencedColumns: ['id'];
          },
        ];
      };
      inventory: {
        Row: {
          id: string;
          farm_id: string;
          product_id: string;
          quantity: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          product_id: string;
          quantity: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inventory_farm_id_fkey';
            columns: ['farm_id'];
            isOneToOne: false;
            referencedRelation: 'farms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inventory_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      sales: {
        Row: {
          id: string;
          farm_id: string;
          total: number;
          sold_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          total: number;
          sold_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          total?: number;
          sold_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_farm_id_fkey';
            columns: ['farm_id'];
            isOneToOne: false;
            referencedRelation: 'farms';
            referencedColumns: ['id'];
          },
        ];
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price_at_time: number;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price_at_time: number;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          quantity?: number;
          price_at_time?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'sale_items_sale_id_fkey';
            columns: ['sale_id'];
            isOneToOne: false;
            referencedRelation: 'sales';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sale_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};