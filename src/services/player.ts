import axios from 'axios'

// test
const TEST_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

// kaynak
export function getStreamSource(_type?: string, _id?: string | number): string {
  return TEST_HLS
}

// akis (OPTIONS + GET)
export async function fetchStream(url: string = TEST_HLS): Promise<string | null> {
  try {
    await axios.options(url)
  } catch {
    // yok
  }
  try {
    const res = await axios.get(url, { responseType: 'text' })
    return res.data as string
  } catch {
    return null
  }
}
