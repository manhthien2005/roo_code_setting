# 📋 Nhật Ký Thay Đổi (Changelog)

Tất cả thay đổi đáng chú ý của dự án sẽ được ghi nhận trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.3.0] - 2025-04-12

### 🎨 Thêm mới — Chế độ FE Designer

- **Chế độ FE Designer** hoàn chỉnh với định nghĩa mode trong `.roomodes`
- 📏 **5 file quy tắc thiết kế**: design discipline, visual standards, accessibility, component patterns, UI critique
- 🛠️ **4 skills mới**: `accessibility-checker`, `component-design`, `design-system-audit`, `ui-critique`
- 🎯 **3 bộ design token presets**: minimalist, corporate, creative
- 📚 **7 file tham chiếu style**: buttons, forms, cards, navigation, modals, typography, layout
- 🔌 Thêm quy tắc `context7-awareness.md` cho tích hợp Context7 MCP

### ⚙️ Tối ưu cài đặt Template (`roo-code-settings-optimized.json`)

- 🧠 **Model Opus 4.6**: giảm context window 244K → 160K (tiết kiệm token, tăng tốc)
- 🚫 **Tắt streaming** cho Opus (`openAiStreamingEnabled: false`) — ổn định hơn
- ⏱️ **Rate limit**: `rateLimitSeconds: 0` (không delay giữa các request)
- 🔄 **Tăng retry**: `consecutiveMistakeLimit: 5` (cho phép nhiều lần thử hơn)
- ✅ **Auto-approve đầy đủ**: bật read/write ngoài workspace, protected files
- ⏰ **Timeout auto-approve**: `followupAutoApproveTimeoutMs: 60000` (60 giây)
- 🔊 **Âm thanh thông báo**: bật `soundEnabled: true`
- 📁 **Quy tắc thư mục con**: bật `enableSubfolderRules: true`
- ✨ **Enhance Prompt**: cài đặt custom prompt hoạt động với `${userInput}` + tắt `includeTaskHistoryInEnhance`

### 📝 Cập nhật

- Cập nhật quy tắc dùng chung: `definition-of-done`, `mode-collaboration`, `skill-awareness`
- Cập nhật tài liệu: `architecture.md`, `getting-started.md`
- Cập nhật `mcp.json` với cấu hình cho FE Designer

---

## [2.2.0] - 2025-04-11

### 🔧 Tích hợp Ecosystem Patterns & Nâng cao Workflow

- 🧩 Thêm **Complexity Decision Tree** vào `reasoning-optimization.md` — phân loại task tự động
- ✅ Thêm **Pre-Switch Verification** checklist vào `mode-collaboration.md` — kiểm tra trước khi chuyển mode
- 📊 Thêm **Observability bullets** vào `core-principles.md` — ghi log quyết định, ghi nhận lỗi
- 🔄 Thêm **Step 0 context restoration** vào `continuous-learning` skill — khôi phục ngữ cảnh từ phiên trước
- 📐 Thêm **Source-of-Truth Separation** vào `architecture.md` — tách biệt nguồn dữ liệu tin cậy
- 🔗 Thêm **cross-reference indexing ↔ code-review-graph** vào `development-workflow.md`

### 📝 Cập nhật

- Cập nhật `GLOBAL_SKILL_MAP` count lên 29 trong tests
- Nâng cao `.gitignore`, `.rooignore`, `coding-standards`, `context-budget`, `lint-and-validate`
- Cập nhật installer, README, tài liệu getting-started
- Thêm **Scope Discipline** vào `core-principles.md` — chống scope creep
- Thêm **Phase Gate Enforcement** vào `development-workflow.md` — kiểm soát chất lượng từng giai đoạn

---

## [2.1.0] - 2025-04-10

### 🧠 Thêm mới — Tích hợp Code Knowledge Graph

- **Tích hợp Code Knowledge Graph** qua MCP server [code-review-graph](https://github.com/tirth8205/code-review-graph)
- Cấu hình MCP cho `code-review-graph` trong `templates/mcp.json` (tổng 4 MCP servers)
- Quy tắc toàn cục: `code-graph-awareness.md` — sử dụng graph tool có điều kiện, workflow tiết kiệm token, giao thức blast-radius
- Quy tắc theo mode: `graph-assisted-coding.md`, `graph-assisted-review.md`, `graph-assisted-debugging.md`, `graph-assisted-architecture.md`
- 3 skills toàn cục mới: `code-graph-build`, `code-graph-review`, `code-graph-impact` (tổng 29 skills)
- Báo cáo phân tích: `docs/analysis-code-graph-tools.md` so sánh code-review-graph vs GitNexus

### 📝 Cập nhật

- `skill-awareness.md` cập nhật với graph skills và tham chiếu quy tắc liên quan
- `bin/install.js` mở rộng fileMap thêm 5 mục graph rule
- `lib/installer.js` mở rộng GLOBAL_SKILL_MAP thêm 3 graph skills
- `README.md` cập nhật: skills 26→29, MCP servers 3→4, rules 19→24
- `docs/architecture.md` cập nhật sơ đồ graph layer, MCP tools layer, và phần 7

---

## [2.0.0] - 2025-04-09

### ⚠️ Thay đổi không tương thích (Breaking Changes)

- Cấu hình MCP (`templates/mcp.json`) chuyển sang dùng chuỗi placeholder thay vì cú pháp `${VAR}`
  - `${GITHUB_PERSONAL_ACCESS_TOKEN}` → `"paste-your-github-token-here"`
  - `${DATABASE_URL}` → `"postgresql://user:password@localhost:5432/dbname"`
  - `${WORKSPACE_PATH}` → `"/path/to/your/workspace"`

### ✨ Thêm mới

- Flag `--version` / `-v` để in phiên bản package
- Flag `--clean` để phát hiện và xóa orphan global skills từ `~/.roo/`
- Xử lý lỗi thân thiện cho lỗi quyền truy cập (EACCES/EPERM)
- `lib/installer.js` — tách hàm tái sử dụng để dễ test
- Unit tests (`tests/installer.test.js`) và integration tests (`tests/cli.test.js`)
- `CHANGELOG.md` (file này)
- `CONTRIBUTING.md` với hướng dẫn workflow phát triển và PR
- `docs/migration-from-ps1.md` hướng dẫn chuyển đổi từ PowerShell v1 sang Node.js v2
- GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`) — test trên Node 14/18/20, lint rules & skills
- Thêm trường `engines` trong package.json yêu cầu Node >= 14.14.0

### 🐛 Sửa lỗi

- Cú pháp `${VAR}` trong MCP config không được RooCode mở rộng — đã thay bằng chuỗi placeholder
- Tên biến môi trường không khớp giữa output installer và mcp.json
- README ghi sai "8 global rules" (thực tế 9) và "11 rule files" (thực tế 13)
- Installer giờ xử lý lỗi quyền file một cách nhẹ nhàng thay vì crash

### 📝 Cập nhật

- Nâng version từ 1.0.0 lên 2.0.0 (thay đổi format MCP config)
- Tái cấu trúc installer: tách hàm helper vào `lib/installer.js`

---

## [1.0.0] - 2025-03-15

### 🚀 Phát hành đầu tiên

- Phát hành lần đầu
- Trình cài đặt project settings (rules, modes, skills, .rooignore)
- Flag `--global-skills` cho 26 skills toàn cục được tuyển chọn
- Flag `--mcp` cho cấu hình MCP server
- Flag `--force` để ghi đè file đã tồn tại
- 9 quy tắc toàn cục, 4 quy tắc theo mode, 7 project skills
- 13 chế độ tùy chỉnh với cài đặt tối ưu
