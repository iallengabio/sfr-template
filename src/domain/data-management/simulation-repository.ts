import { SimulationRepositoryI } from "@/adapter/interfaces/simulation-repository-interface";
import { Simulation } from "./Entities/simulation";

export class SimulationRepository implements SimulationRepositoryI {

  private storagePrefix = "simulation_";

  private getStorageKey(id: string): string {
    return `${this.storagePrefix}${id}`;
  }

  async save(simulation: Simulation): Promise<void> {
    if (simulation.id) {
      this.delete(simulation.id);
    } 
    simulation.id = crypto.randomUUID();
    localStorage.setItem(this.getStorageKey(simulation.id), JSON.stringify(simulation));
  }

  async getById(id: string): Promise<Simulation | null> {
    let data = localStorage.getItem(this.getStorageKey(id));
    return data ? JSON.parse(data) : null;
  }

  async getAll(): Promise<Simulation[]> {
    let simulations: Simulation[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        let data = localStorage.getItem(key);
        if (data) {
          simulations.push(JSON.parse(data));
        }
      }
    }
    return simulations;
  }

  async delete(id: string): Promise<void> {
    localStorage.removeItem(this.getStorageKey(id));
  }
}
