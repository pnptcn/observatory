import { useState, ChangeEvent } from "react"

interface UploadProps<T> {
    parser: (file: File) => Promise<T>
    presenter: (data: T) => JSX.Element
}

const Upload = <T,>({ parser, presenter }: UploadProps<T>): JSX.Element => {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                const parsedData = await parser(file)
                setData(parsedData)
                setError(null)
            } catch (err) {
                console.error(err)
                setError("Error parsing file")
            }
        }
    }

    return (
        <div className="upload-container">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            {error && <div className="error-message">{error}</div>}
            {data && presenter(data)}
        </div>
    )
}

export default Upload

