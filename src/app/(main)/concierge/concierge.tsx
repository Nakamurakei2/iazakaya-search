"use client";

import { useState } from "react";
import { IoMicOutline, IoSend } from "react-icons/io5";
import { RiArrowRightSLine, RiRobot2Line } from "react-icons/ri";
import { MdOutlineRestaurant, MdTune } from "react-icons/md";
import { FaBookmark, FaCheckCircle, FaWalking } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { TbDeviceIpadSearch } from "react-icons/tb";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function ConciergeForm() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outputText, setOutputText] = useState("");

  /**
   * fetch data using Gemini AI
   */
  const aiGenerate = async () => {
    if (!input) {
      toast.error("入力して下さい");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      console.log("data!!!", data);

      console.log("data.outputText", data.outputText);
      setOutputText(data.outputText);
    } catch (e: unknown) {
      console.error("e", e);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "予算をもう少し抑えたい",
    "2軒目を静かなBARに変更",
    "2軒目も個室希望",
  ];

  return (
    <div className="dark min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Main */}
      <div
        className="relative flex min-h-screen w-full flex-col bg-[#131313] pt-16"
        style={{ paddingBottom: "180px" }}
      >
        <ReactMarkdown>{outputText}</ReactMarkdown>
        <div className="flex w-full flex-col">
          {/* AI Status */}
          <div className="flex items-center justify-between px-5 pb-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff8c00] shadow-[0_0_10px_#ff8c00]" />

              <span className="text-sm font-bold text-[#e5e2e1]">
                AI はしご酒コンシェルジュ
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-[#2a2a2a] px-2.5 py-1 shadow-sm">
              <span
                className="material-symbols-outlined text-[14px] text-[#ffb77d]"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                <BsStars />
              </span>

              <span className="text-xs font-semibold text-[#ffb77d]">
                LLM Engine 稼働中
              </span>
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col gap-6 px-5">
            {/* User Message */}
            <div className="ml-auto flex max-w-[88%] flex-col items-end gap-1">
              <div className="rounded-2xl rounded-tr-none bg-[#ff8c00] px-4 py-3 text-[#4d2600] shadow-md">
                <p className="text-base font-semibold leading-snug">
                  4名で19時から渋谷スタート！1軒目はじっくり話せる海鮮・日本酒のお店、2軒目は雰囲気を変えてクラフトビールが美味しいバルではしご酒したいです。予算は1人合計8,000円以内で組めますか？
                </p>
              </div>

              <span className="pr-1 text-xs font-semibold text-[#ddc1ae]">
                18:42 · 4名 / 渋谷 / 予算¥8,000
              </span>
            </div>

            {/* AI Message */}
            <div className="flex w-full items-start gap-2">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffb77d]/20 shadow-[0_0_8px_rgba(255,140,0,0.25)]">
                <RiRobot2Line className="scale-12" />
              </div>

              <div className="flex max-w-[86%] flex-col gap-1">
                <div className="rounded-2xl rounded-tl-none bg-[#2a2a2a] px-4 py-3 shadow-sm">
                  <p className="text-base">
                    お任せください！渋谷駅周辺で移動のしやすさと雰囲気の変化を重視した、おすすめの
                    <span className="font-bold text-[#ffb77d]">
                      「渋谷はしご酒ナイトプラン」
                    </span>
                    を作成しました🍶🍺
                  </p>
                </div>

                <span className="pl-1 text-xs font-semibold text-[#ddc1ae]">
                  Gemini AI
                </span>
              </div>
            </div>

            {/* Plan Card */}
            <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-[#201f1f] shadow-xl">
              {/* Plan Header */}
              <div className="flex items-center justify-between bg-[#353534] p-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[13px] text-[#ffb77d]">
                    <TbDeviceIpadSearch className="scale-14" />
                  </span>

                  <span className="text-sm font-bold text-[#e5e2e1]">
                    ご提案：黄金の渋谷はしご酒コース
                  </span>
                </div>

                <div className="rounded-full bg-[#ffb77d]/20 px-2 py-0.5">
                  <span className="text-xs font-bold text-[#ffb77d]">
                    全2軒・約4時間
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4">
                {/* Shop 1 */}
                <div className="flex flex-col gap-2 rounded-xl bg-[#1c1b1b] p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-[#ffb77d] px-2 py-0.5 text-xs font-bold text-[#4d2600]">
                        1軒目
                      </span>

                      <span className="text-xs font-semibold text-[#ddc1ae]">
                        19:00 - 21:00 (120分)
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#ffb77d]">
                      ¥4,500{" "}
                      <span className="text-xs font-semibold text-[#ddc1ae]">
                        /人
                      </span>
                    </span>
                  </div>

                  <div className="mt-1 flex gap-4">
                    <img
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      alt="渋谷の海鮮居酒屋"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkDyf9uKiGwilZMlcVMMfc-sX_JhzWbUhpv4Ps7IY5V5xGWbY3GVrArl9HSvbdLY_h4gcOCKHz_r8Ei5lsLHGL9CFjjM4hk8L8i0FFyJNvPPI1ctR0kOZtLOIhvomBFmOLxSMyQFAl-5iIEYaWYpy6fskCPolgeNOyOn81iwQe3wuZFYOiyZKFJ0CZETw-52SNt7-fD3bugAwTfmc73cc9yiw6vKNQQNTueYA5udohpBruN1xsIS8Avg"
                    />

                    <div className="flex min-w-0 flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <h3 className="truncate text-lg font-bold text-[#e5e2e1]">
                          海鮮酒場 凪
                        </h3>

                        <span className="text-xs text-[#ddc1ae]">道玄坂</span>
                      </div>

                      <p className="mt-0.5 truncate text-xs font-semibold text-[#ffb77d]">
                        名物こぼれ寿司＆鮮魚刺身 厳選地酒コース
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="flex items-center gap-0.5 rounded bg-[#2a2a2a] px-2 py-0.5 text-xs text-[#ddc1ae]">
                          <span
                            className="material-symbols-outlined text-[13px] text-[#ffb77d]"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            <FaCheckCircle className="scale-12 mr-1" />
                          </span>
                          個室テーブル確約
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transfer */}
                <div className="flex items-center gap-2 px-2 py-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2a] text-[#ddc1ae]">
                    <span className="material-symbols-outlined text-[16px]">
                      <FaWalking />
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-between text-xs text-[#ddc1ae]">
                    <span>21:00 - 21:15 徒歩3分でスムーズ移動</span>

                    <span className="flex items-center font-semibold text-[#ffb77d]">
                      ルート表示
                      <span className="material-symbols-outlined text-[14px]">
                        <RiArrowRightSLine className="scale-13" />
                      </span>
                    </span>
                  </div>
                </div>

                {/* Shop 2 */}
                <div className="flex flex-col gap-2 rounded-xl bg-[#1c1b1b] p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-[#ffb95a] px-2 py-0.5 text-xs font-bold text-[#462a00]">
                        2軒目
                      </span>

                      <span className="text-xs font-semibold text-[#ddc1ae]">
                        21:15 - 23:00 (105分)
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#ffb95a]">
                      ¥3,200{" "}
                      <span className="text-xs font-semibold text-[#ddc1ae]">
                        /人
                      </span>
                    </span>
                  </div>

                  <div className="mt-1 flex gap-4">
                    <img
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      alt="渋谷のクラフトビールバー"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaf1a-2qUMKTTTHHNPuEWulIjl9ylfYeoMgNIu3ghqHf7GKa6a0sjh8lBQtanxnpqdej3lxDJl0dQwIGndvdvQqmXJiTWlV5-cr22FJc8Bw-rj_jxPigPAZ3RhPQ_a-KR-0XydF688Klpx0d8EQT5Z7WtlusNgI7YznNP_iQbO4aRPa6aC-jseSIby7Pr6ofoVZOazPxdvDJ0zQP0vZ9wCoVfjBevc43qj2wnmAqrrn2mpDyYLiOgk8A"
                    />

                    <div className="flex min-w-0 flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <h3 className="truncate text-lg font-bold text-[#e5e2e1]">
                          麦酒場 クラフト
                        </h3>

                        <span className="text-xs text-[#ddc1ae]">宇田川町</span>
                      </div>

                      <p className="mt-0.5 truncate text-xs font-semibold text-[#ffb95a]">
                        自慢のクラフトビール2杯＋自家製燻製セット
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="flex items-center gap-0.5 rounded bg-[#2a2a2a] px-2 py-0.5 text-xs text-[#ddc1ae]">
                          <span
                            className="material-symbols-outlined text-[13px] text-[#ffb95a]"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            <FaCheckCircle className="scale-12 mr-1" />
                          </span>
                          ハイテーブル席
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="gap-3 mt-1 flex items-center justify-between rounded-xl bg-[#353534] p-4 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#ddc1ae]">
                      合計予定金額 (1名あたり)
                    </span>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#ffb77d]">
                        ¥7,700
                      </span>

                      <span className="text-xs font-semibold text-[#ddc1ae] line-through">
                        ¥8,500
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-[#1c1b1b] px-3 py-1.5">
                    <span
                      className="material-symbols-outlined text-[16px] text-[#ffb77d]"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      <FaCheckCircle className="scale-12" />
                    </span>

                    <span className="ml-2 text-sm font-bold text-[#ffb77d]">
                      予算クリア (-¥300)
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-2 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-1 rounded-xl bg-[#2a2a2a] px-4 py-2.5 text-xs font-bold text-[#e5e2e1] transition-all hover:bg-[#353534] active:scale-95"
                    >
                      <MdOutlineRestaurant />
                      <span>1軒目だけ予約</span>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-1 rounded-xl bg-[#2a2a2a] px-4 py-2.5 text-xs font-bold text-[#e5e2e1] transition-all hover:bg-[#353534] active:scale-95"
                    >
                      <FaBookmark />

                      <span>プランを保存</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Follow-up */}
            <div className="flex w-full items-start gap-2">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffb77d]/20">
                <RiRobot2Line className="scale-12" />
              </div>

              <div className="flex max-w-[86%] flex-col gap-1">
                <div className="rounded-2xl rounded-tl-none bg-[#2a2a2a] px-4 py-3 shadow-sm">
                  <p className="text-base">
                    2軒目の開始時間や料理の好みに合わせてプランの再調整も可能です。変更したい点があればお気軽にお知らせください！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-col gap-2 px-5">
            <div className="flex items-center gap-1 text-[#ddc1ae]">
              <MdTune />

              <span className="text-xs font-semibold">クイック調整候補:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setInput(action)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#2a2a2a] px-3 py-1.5 text-xs font-semibold text-[#e5e2e1] shadow-sm transition-all hover:bg-[#353534] active:scale-95"
                >
                  <span>
                    {action === "予算をもう少し抑えたい" && "💰 "}
                    {action === "2軒目を静かなBARに変更" && "🍸 "}
                    {action === "2軒目も個室希望" && "🚪 "}
                    {action}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="mt-4 px-5 concierge-input-wrapper">
            {isLoading && (
              <div className="mb-2 flex items-center gap-2 px-5 text-sm text-[#ddc1ae]">
                <span>条件を整理しています</span>
                <span className="loading-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl bg-[#2a2a2a] p-1.5 shadow-lg">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#ddc1ae] transition-colors hover:text-[#ffb77d] active:scale-90"
              >
                <span className="material-symbols-outlined text-[22px]">
                  <IoMicOutline className="scale-13" />
                </span>
              </button>

              <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="人数・時間・予算"
                disabled={isLoading}
                minRows={1} // 初期状態の行数
                maxRows={5} // 最大何行まで伸ばすか（これ以上はスクロールになる）
                className="min-w-0 flex-1 bg-transparent text-base text-[#e5e2e1] outline-none placeholder:text-[#ddc1ae]"
              />

              <button
                type="button"
                // 修正ポイント：\${} の中に三項演算子を正しく収め、共通クラスと切り替えクラスを整理しました
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffb77d] text-[#4d2600] shadow-md transition-all active:scale-90 ${
                  isLoading ? "btn-loading opacity-50" : ""
                }`}
                onClick={aiGenerate}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined text-[20px]">
                  <IoSend />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
