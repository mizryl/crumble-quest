import { Player } from '../entities/Player.js';
import { Customer } from '../entities/Customer.js';

export class MovementLogger {
  /**
   * Captures movement data, ranks entities, and exports a .txt file.
   * @param entities Array containing the player and all active customers.
   */
  static exportReport(entities: (Player | Customer)[]): void {
    let report: string[] = [];
    
    report.push("==========================================");
    report.push("      CRUMBLE QUEST - MOVEMENT LOG       ");
    report.push(`      Generated: ${new Date().toLocaleString()}     `);
    report.push("==========================================");
    report.push("");

    // Comparison/Ranking Logic
    // Sorts the array: Highest total Distance Moved at the top
    const ranked = [...entities].sort((a, b) => b.totalDistanceMoved - a.totalDistanceMoved);

    report.push("RANKING BY ACTIVITY:");
    report.push("------------------------------------------");

    // Format Data & Coordinates
    ranked.forEach((e, index) => {
      // Determine if it's the player or a customer for the log
      const type = e instanceof Player ? "BAKER" : "GUEST";
      
      const line = `${index + 1}. [${type}] ID: ${e.entityId}\n` +
                   `   Total Distance: ${e.totalDistanceMoved.toFixed(2)}px\n` +
                   `   Final Position: X: ${e.x.toFixed(2)}, Y: ${e.y.toFixed(2)}\n`;
      report.push(line);
    });

    report.push("------------------------------------------");
    report.push("End of Day Report Generated Successfully.");

    // Generate External File (Triggers Browser Download)
    (window as any).saveStrings(report, 'CrumbleQuest_Movement_Report.txt');
  }
}