import { defineBlockSchema, SchemaToModel } from "@blocksuite/store"
import { html } from "lit"
import { customElement } from "lit/decorators.js"
import { BlockElement } from "@blocksuite/lit"

export const CSVAnalysisSchema = defineBlockSchema({
    flavour: "csv-analysis",
    props: {
        csvData: "",
        analysisResult: {},
    },
    metadata: {
        version: 1,
        role: "content",
    },
})

@customElement("csv-analysis-block")
export class CSVAnalysisBlock extends BlockElement<SchemaToModel<typeof CSVAnalysisSchema>> {
    override render() {
        const { csvData, analysisResult } = this.model

        return html`
      <div>
        <h3>CSV Analysis</h3>
        ${this.mode === "editing"
                ? html`
              <textarea
                .value=${csvData}
                @input=${(e: Event) => this.updateCSVData((e.target as HTMLTextAreaElement).value)}
              ></textarea>
              <button @click=${this.performAnalysis}>Analyze</button>
            `
                : html`
              <pre>${JSON.stringify(analysisResult, null, 2)}</pre>
            `
            }
      </div>
    `
    }

    updateCSVData(newData: string) {
        this.page.updateBlock(this.model, { csvData: newData })
    }

    performAnalysis() {
        // Perform your CSV analysis here
        const result = { /* your analysis result */ }
        this.page.updateBlock(this.model, { analysisResult: result })
    }
}

