import { Injectable } from '@nestjs/common';

@Injectable()
export class DamageService {
    private damageLog: any[] = [];

    calculateDamage(attacker: any, defender: any): number {
        const baseDamage = attacker.attack - defender.defense;
        return baseDamage > 0 ? baseDamage : 0;
    }

    recordDamage(attacker: any, defender: any, damage: number): void {
        this.damageLog.push({
            attackerId: attacker.id,
            defenderId: defender.id,
            damage,
            timestamp: new Date(),
        });
    }

    getDamageLog(): any[] {
        return this.damageLog;
    }
}