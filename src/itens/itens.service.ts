import { Injectable } from '@nestjs/common';

@Injectable()
export class ItensService {
    private itens: any[] = []; // Array para armazenar os itens

    // Método para adicionar um item
    addItem(item: any) {
        this.itens.push(item);
    }

    // Método para obter todos os itens
    getAllItems() {
        return this.itens;
    }

    // Método para obter um item pelo ID
    getItemById(id: number) {
        return this.itens.find(item => item.id === id);
    }

    // Método para remover um item pelo ID
    removeItem(id: number) {
        this.itens = this.itens.filter(item => item.id !== id);
    }
}