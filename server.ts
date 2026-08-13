import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from 'better-sqlite3';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const db = new Database('pc_store.db');

// Setup DB
db.exec(`
CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    category TEXT,
    name TEXT,
    price INTEGER,
    stock_status TEXT,
    image_url TEXT,
    description TEXT
);
`);

const checkDb = db.prepare('SELECT COUNT(*) as count FROM components').get() as { count: number };
if (checkDb.count === 0) {
  const insert = db.prepare(`INSERT INTO components (id, category, name, price, stock_status, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
  const seedData = [
    { id: 'c1', category: 'CPU', name: 'Intel Core i5-12400F', price: 3300000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600', description: '6 Cores / 12 Threads • 4.4 GHz Max Boost • LGA1700' },
    { id: 'c2', category: 'VGA', name: 'RTX 4060 8GB VRAM', price: 7500000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', description: '8GB GDDR6 • Ada Lovelace Architecture • DLSS 3' },
    { id: 'c3', category: 'MAIN', name: 'B760M AORUS ELITE', price: 2800000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', description: 'Micro-ATX • DDR5 Support • 2x M.2 Slots' },
    { id: 'c4', category: 'RAM', name: '16GB DDR5 5200MHz', price: 1200000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600', description: '2x8GB Dual Channel • CL40 • RGB Sync' },
    { id: 'c5', category: 'PSU', name: '650W 80 Plus Bronze', price: 1050000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600', description: 'Active PFC • 120mm Fan • OVP/UVP/OPP' },
    { id: 'c6', category: 'CASE', name: 'NZXT H5 Flow', price: 2000000, stock_status: 'in_stock', image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600', description: 'ATX Mid Tower • High Airflow' },
  ];
  
  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item.id, item.category, item.name, item.price, item.stock_status, item.image_url, item.description);
    }
  });
  insertMany(seedData);
}

function buildDynamicPrompt(userMessage: string) {
    const messageLower = userMessage.toLowerCase();
    
    let basePrompt = `[ROLE] Bạn là "AI Sale" tư vấn PC xuất sắc.
[TASK] Tư vấn và lên cấu hình PC.
[CORE_RULES] 
- KHÔNG tự bịa giá hay thông số.
- Khi khách chốt ngân sách và nhu cầu, BẮT BUỘC gọi tool \`generate_pc_build\`.
- Dừng chat ngay sau khi gọi tool.`;

    const currentTime = new Date().toLocaleDateString("vi-VN");
    const promoInfo = "Tặng chuột Logitech G102 cho mọi hóa đơn trên 15 triệu.";
    const dynamicContext = `\n[CONTEXT]\n- Hôm nay là: ${currentTime}\n- Khuyến mãi đang chạy: ${promoInfo}`;

    let microRules = "\n[SPECIFIC_RULES]";
    let hasSpecificRules = false;

    if (["đồ họa", "render", "edit video", "3d", "ai"].some(k => messageLower.includes(k))) {
        microRules += "\n- KHÁCH LÀM ĐỒ HỌA: Ưu tiên tuyệt đối Card màn hình (VGA) của NVIDIA. Không tư vấn VGA AMD.";
        hasSpecificRules = true;
    }

    if (["i9", "14900k", "ryzen 9", "7950x"].some(k => messageLower.includes(k))) {
        microRules += "\n- CPU NHIỆT ĐỘ CAO: Bắt buộc tư vấn kèm Tản nhiệt nước AIO 360mm.";
        hasSpecificRules = true;
    }
        
    if (["rẻ", "sinh viên", "tiết kiệm", "dưới 10 triệu"].some(k => messageLower.includes(k))) {
        microRules += "\n- NGÂN SÁCH THẤP: Ưu tiên build CPU có tích hợp sẵn card đồ họa hoặc các combo H610 + i3.";
        hasSpecificRules = true;
    }

    let finalPrompt = basePrompt + dynamicContext;
    if (hasSpecificRules) {
        finalPrompt += microRules;
    }
        
    return finalPrompt;
}

function generatePcBuild(budget: number, usage: string, cpuBrand: string = "Any", template: string = "FrameA") {
    const items = db.prepare(`
        SELECT id, category, name, price, image_url, description 
        FROM components 
        WHERE stock_status = 'in_stock'
        ORDER BY price DESC LIMIT 6
    `).all() as any[];

    const buildResult = [];
    let totalPrice = 0;
    
    for (const item of items) {
        let reason = "Đảm bảo hiệu suất ổn định và độ bền cao cho toàn bộ hệ thống.";
        const usageLower = usage.toLowerCase();
        
        if (item.category === 'CPU') {
            reason = usageLower.includes('đồ họa') || usageLower.includes('3d') || usageLower.includes('render')
                ? "Sức mạnh đa nhân cực khủng, giúp rút ngắn tối đa thời gian render và xử lý mượt mà các file project phức tạp."
                : "Xung nhịp đơn nhân cao, tối ưu tuyệt đối cho FPS khi chơi game và phản hồi nhanh các tác vụ thời gian thực.";
        } else if (item.category === 'VGA') {
            reason = usageLower.includes('3d') || usageLower.includes('render')
                ? "Bộ nhớ VRAM lớn cùng hệ thống nhân CUDA vượt trội, render siêu tốc và preview mượt mà không lo giật lag."
                : "Tích hợp công nghệ dò tia (Ray Tracing) và DLSS tiên tiến, mang lại trải nghiệm hình ảnh sắc nét, mượt mà nhất.";
        } else if (item.category === 'MAIN') {
            reason = "Hỗ trợ băng thông thế hệ mới nhất, loại bỏ hoàn toàn hiện tượng nghẽn cổ chai (bottleneck) giữa linh kiện.";
        } else if (item.category === 'RAM') {
            reason = "Dung lượng dồi dào với bus cực cao, cho phép đa nhiệm mượt mà hàng chục ứng dụng và tab trình duyệt cùng lúc.";
        } else if (item.category === 'PSU') {
            reason = "Công suất thực đạt chuẩn 80 Plus, cung cấp dòng điện sạch, bảo vệ an toàn tối đa cho các linh kiện đắt tiền.";
        } else if (item.category === 'CASE') {
            reason = "Thiết kế luồng khí (Airflow) thông minh, giúp tản nhiệt tối ưu và duy trì nhiệt độ mát mẻ khi máy tải nặng.";
        }

        buildResult.push({
            id: String(item.id),
            type: item.category,
            name: item.name,
            price: item.price,
            img: item.image_url || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600',
            specs: item.description || 'Standard specs',
            reason: reason
        });
        totalPrice += item.price;
    }

    return {
        status: "success",
        ui_component: template,
        data: {
            title: template === "FrameA" ? "SYSTEM ARCHITECTURE" : "HUD_DIAGNOSTIC_MODE",
            totalPrice: totalPrice,
            components: buildResult
        }
    };
}


async function startServer() {
  const app = express();
  app.use(express.json());
  
  app.post("/api/chat", async (req, res) => {
    try {
        const userMessages = req.body.messages || [];
        const latestUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : "";
        const dynamicSystemPrompt = buildDynamicPrompt(latestUserMessage);
        
        const formattedMessages = userMessages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || "" }]
        }));

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: formattedMessages,
            config: {
                systemInstruction: dynamicSystemPrompt,
                tools: [{
                    functionDeclarations: [{
                        name: 'generate_pc_build',
                        description: 'Lấy linh kiện từ DB. Bắt buộc chọn template: FrameA (tổng quan đẹp mắt) hoặc FrameB (chi tiết kỹ thuật sci-fi).',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                budget: { type: Type.INTEGER, description: "Ngân sách (VND)" },
                                usage: { type: Type.STRING, description: "Nhu cầu" },
                                cpu_brand: { type: Type.STRING, description: "Hãng CPU: Intel/AMD/Any" },
                                template: { type: Type.STRING, description: "FrameA or FrameB" }
                            },
                            required: ['budget', 'usage', 'template']
                        }
                    }]
                }]
            }
        });
        
        let toolData = null;
        const functionCall = response.functionCalls?.[0];
        
        if (functionCall && functionCall.name === 'generate_pc_build') {
            const args = functionCall.args as any;
            const dbResult = generatePcBuild(
                args.budget || 15000000,
                args.usage || 'gaming',
                args.cpu_brand || 'Any',
                'FrameA'
            );
            
            toolData = dbResult;
            
            return res.json({
                role: "assistant",
                content: "Dạ em đã lên xong cấu hình tối ưu nhất cho anh/chị dựa trên yêu cầu rồi ạ. Anh/chị xem bảng báo giá chi tiết ở giao diện nhé!",
                tool_data: toolData
            });
        }
        
        res.json({
            role: "assistant",
            content: response.text || "",
            tool_data: null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ role: "assistant", content: "Error talking to AI" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
