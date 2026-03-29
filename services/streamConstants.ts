
import SOEData from '../mock-data/video_json_data/SOE.json';
import SOFData from '../mock-data/video_json_data/SOF.json';
import SOMData from '../mock-data/video_json_data/SOM.json';

export const VIDEO_BASE_URL = "https://d3vo8rtp78h2dc.cloudfront.net/";
export const THUMBNAIL_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";
export const STREAMS = ["SOE", "SOF", "SOM"];

export const STREAM_DATA: Record<string, any[]> = {
  "SOE": SOEData,
  "SOF": SOFData,
  "SOM": SOMData
};
