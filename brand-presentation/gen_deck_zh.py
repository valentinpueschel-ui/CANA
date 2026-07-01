#!/usr/bin/env python3
# 迦拿 · 加利利 — 品牌与产品系列 (Chinese edition). reportlab. 和合本 verses, localized copy.
import os
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from PIL import Image

ROOT="/Users/valentinpueschel/Desktop/Cana Website Kit"; PUB=ROOT+"/public/images"; FP=ROOT+"/factory-pack"
SCR="/private/tmp/claude-501/-Users-valentinpueschel/499571b2-fd0d-4422-a09c-4d0ba83b37d9/scratchpad"
FONTS=SCR+"/fonts"; TMP=SCR+"/_deckimg"; os.makedirs(TMP, exist_ok=True)
OUT=SCR+"/Cana-Brand-Presentation-ZH.pdf"

for nm in ["Cormorant-Medium","Cormorant-Italic","WorkSans-Regular","WorkSans-Medium",
           "NotoSerifSC-Regular","NotoSerifSC-SemiBold","NotoSansSC-Regular","NotoSansSC-Medium"]:
    pdfmetrics.registerFont(TTFont(nm, f"{FONTS}/{nm}.ttf"))
registerFontFamily("NotoSansSC-Regular", normal="NotoSansSC-Regular", bold="NotoSansSC-Medium",
                   italic="NotoSansSC-Regular", boldItalic="NotoSansSC-Medium")
# fonts: ZS* = Noto Serif SC (display/verse), ZH* = Noto Sans SC (body/label)
ZS_SB="NotoSerifSC-SemiBold"; ZS_R="NotoSerifSC-Regular"; ZH_R="NotoSansSC-Regular"; ZH_M="NotoSansSC-Medium"

BONE=HexColor("#F4EDDE"); LINEN=HexColor("#E7DAC4"); UMBER=HexColor("#54442F"); ESP=HexColor("#3A2E20")
OLIVE=HexColor("#7C7A53"); GOLD=HexColor("#B5934E"); MUT=HexColor("#8C7A60"); LINE=HexColor("#D8CCB4")
CARD=HexColor("#FBF7EF")
W,H=960,540; M=58
c=canvas.Canvas(OUT, pagesize=(W,H))

def page(col=BONE): c.setFillColor(col); c.rect(0,0,W,H,fill=1,stroke=0)
def boxT(x,top,w,h,col): c.setFillColor(col); c.rect(x,H-top-h,w,h,fill=1,stroke=0)
def rule(x,top,w,col=OLIVE,wd=0.8): c.setStrokeColor(col); c.setLineWidth(wd); c.line(x,H-top,x+w,H-top)
def T(x,base,s,font,size,col,align="left",track=0):
    c.setFont(font,size); c.setFillColor(col); yy=H-base
    if not track:
        if align=="center": c.drawCentredString(x,yy,s)
        elif align=="right": c.drawRightString(x,yy,s)
        else: c.drawString(x,yy,s);
        return
    tw=sum(c.stringWidth(ch,font,size)+track for ch in s)-track
    x0=x-tw/2 if align=="center" else (x-tw if align=="right" else x)
    for ch in s:
        c.drawString(x0,yy,ch); x0+=c.stringWidth(ch,font,size)+track

# CJK line-breaking with 禁则 (kinsoku): punctuation may not begin a line.
STYLES={"body":(ZH_R,10.5,18,ESP),"lead":(ZH_R,11,19,ESP),"small":(ZH_R,9.5,15.5,ESP),"ph":(ZS_SB,17,21,UMBER)}
_CLOSE="，。、；：！？）」』】》〉·—…％%"
def wrap_zh(s,font,size,maxw):
    lines=[]; cur=""
    for ch in s:
        if not cur or c.stringWidth(cur+ch,font,size)<=maxw: cur+=ch
        elif ch in _CLOSE: cur+=ch; lines.append(cur); cur=""
        else: lines.append(cur); cur=ch
    if cur: lines.append(cur)
    return lines
def para(t,x,top,w,style="body"):
    font,size,leading,color=STYLES[style]; t=t.replace("<b>","").replace("</b>","")
    lines=wrap_zh(t,font,size,w)
    for i,ln in enumerate(lines): T(x,top+size+i*leading,ln,font,size,color)
    return len(lines)*leading

def kicker(x,base,s,col=OLIVE): T(x,base,s,ZH_M,9.5,col,track=3.2)
def kickrule(x,base,s,col=OLIVE): rule(x,base-3.5,26,col,1); kicker(x+34,base,s,col)

def img_cover(path,x,top,w,h,q=88):
    im=Image.open(path).convert("RGB"); iw,ih=im.size; tar=w/h; cur=iw/ih
    if cur>tar: nw=int(round(ih*tar)); l=(iw-nw)//2; im=im.crop((l,0,l+nw,ih))
    else: nh=int(round(iw/tar)); t=(ih-nh)//2; im=im.crop((0,t,iw,t+nh))
    capw=int(max(900,w*2))
    if im.width>capw: im=im.resize((capw,int(capw*im.height/im.width)),Image.LANCZOS)
    f=f"{TMP}/cov_{abs(hash((path,w,h)))%10**8}.jpg"; im.save(f,"JPEG",quality=q); c.drawImage(f,x,H-top-h,w,h)
def img_fit(path,x,top,w,h,maxpx=1700):
    im=Image.open(path).convert("RGB")
    if im.width>maxpx: im=im.resize((maxpx,int(maxpx*im.height/im.width)),Image.LANCZOS)
    f=f"{TMP}/fit_{abs(hash((path,w,h)))%10**8}.jpg"; im.save(f,"JPEG",quality=90)
    c.drawImage(f,x,H-top-h,w,h,preserveAspectRatio=True,anchor="c")

_lg=Image.open(SCR+"/olive_deboss_hq.png").convert("RGBA")
_r,_g,_b,_a=_lg.split(); _a=_a.point(lambda v: 0 if v<52 else min(255,int((v-52)*1.7))); _lg.putalpha(_a)
_bg=Image.new("RGBA",_lg.size,(244,237,222,255)); _bg.alpha_composite(_lg)
_bg.crop(_a.getbbox()).convert("RGB").save(TMP+"/logo_bone.png","PNG")
LOGO=TMP+"/logo_bone.png"; _li=Image.open(LOGO); _lr=_li.width/_li.height
def logo(cx,top,w): h=w/_lr; c.drawImage(LOGO,cx-w/2,H-top-h,w,h)

def wordmark(cx,top,cana=52,sub=17):
    T(cx,top+cana*0.74,"CANA","Cormorant-Medium",cana,UMBER,align="center",track=cana*0.12)
    rule(cx-58,top+cana+14,116,OLIVE,0.9)
    T(cx,top+cana+34,"迦拿 · 加利利",ZS_R,sub,UMBER,align="center",track=sub*0.5)

def footer(n,x0=M):
    rule(x0,512,W-M-x0,LINE,0.7)
    T(x0,525,"CANA · GALILEE — 品牌与产品系列",ZH_M,7.5,MUT,track=1.2)
    T(W-M,525,f"{n:02d}",ZH_M,7.5,MUT)

def chips(x,top,items,col=OLIVE):
    cx=x
    for it in items:
        c.setFont(ZH_M,8); w=c.stringWidth(it,ZH_M,8)+18
        c.setStrokeColor(col); c.setLineWidth(0.8); c.roundRect(cx,H-top-16,w,16,8,fill=0,stroke=1)
        c.setFillColor(UMBER); c.drawString(cx+9,H-top-11.2,it); cx+=w+8

# ===================================================== 1 — COVER
page()
img_cover(PUB+"/luminary.png", 432,0, W-432, H)
logo(M+58,86,96)
kicker(M,196,"品牌与产品系列 · 2026")
wordmark(M+150,222,cana=58,sub=19)
T(M,360,"为基督徒的家，制作可以传世的陶瓷。",ZH_R,12,ESP)
T(M,450,"「我们有这宝贝放在瓦器里。」",ZS_R,15,UMBER)
T(M,470,"哥林多后书 4:7",ZH_M,8.5,OLIVE,track=1.5)
c.showPage()

# ===================================================== 2 — BRAND
page()
img_cover(PUB+"/hands.png", 0,0, 452, H)
kickrule(512,150,"品牌")
T(512,196,"可以捧在手中的圣言。",ZS_SB,31,UMBER)
para("迦拿为基督徒的家，制作可以传世的陶瓷——温润的象牙色炻器，将一句圣经经文<b>刻入陶土</b>，"
     "让圣言成为能握在手心的器物。",512,232,W-512-M,"lead")
para("品牌之名取自「加利利的迦拿」——耶稣行第一个神迹之地；那里有筵席、有款待，是平凡被圣化之处。"
     "每一件皆以手工制成，只为被珍藏、被传承。<b>我们雕刻，而非印刷；我们祝福，而不说教。</b>",512,300,W-512-M,"lead")
footer(2,508)
c.showPage()

# ===================================================== 3 — COLLECTION
page()
kickrule(M,86,"产品系列")
T(M,126,"四件器物，一种安静的语言。",ZS_SB,32,UMBER)
prods=[("宁静马克杯","你们要休息，要知道","诗篇 46:10",PUB+"/mug.png"),
       ("祝福碟","愿耶和华赐福给你，保护你","民数记 6:24",PUB+"/dish.png"),
       ("迦拿之光","耶和华是我的亮光","诗篇 27:1",PUB+"/luminary.png"),
       ("「宁静」礼盒","各样美善的恩赐","雅各书 1:17",PUB+"/giftset.png")]
gw=(W-2*M-3*22)/4
for i,(nm,vs,rf,im) in enumerate(prods):
    x=M+i*(gw+22); img_cover(im,x,150,gw,196)
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-150-196,gw,196,fill=0,stroke=1)
    T(x+gw/2,372,nm,ZS_SB,15,UMBER,align="center")
    T(x+gw/2,392,vs,ZS_R,10.5,ESP,align="center")
    T(x+gw/2,408,rf,ZH_M,8,OLIVE,align="center",track=1)
footer(3)
c.showPage()

# ===================================================== 4–7 — PRODUCTS
def product(n,img,nm,verse,ref,body,cs):
    page(); img_cover(img,0,0,476,H)
    kicker(508,120,f"产品系列 · 0{n-3}")
    T(508,166,nm,ZS_SB,27,UMBER)
    T(508,214,verse,ZS_R,22,UMBER); T(508,236,ref,ZH_M,9.5,OLIVE,track=1.5)
    para(body,508,264,W-508-M,"lead")
    chips(508,346,cs)
    footer(n,508); c.showPage()
product(4,PUB+"/mug.png","宁静马克杯","你们要休息，要知道","诗篇 46:10",
 "温润的象牙色炻器，容量 350 毫升。经文刻入杯壁——目光可读，指尖可触。一只值得日日相伴、长久珍藏的杯。",
 ["350 毫升 · 12 oz","洗碗机 · 微波炉适用","经文雕刻"])
product(5,PUB+"/dish.png","祝福碟","愿耶和华赐福给你，保护你","民数记 6:24",
 "直径 200 毫米的浅碟，将祭司的祝福沿碟缘刻下——摆在桌上、门边、床头，日日在目。",
 ["直径 200 毫米","食品级 · 洗碗机适用","碟缘刻字"])
product(6,PUB+"/luminary.png","迦拿之光","耶和华是我的亮光","诗篇 27:1",
 "本系列的核心之作——镂空炻器烛台。放入一枚小茶蜡，暮色之中，一道柔和的十字之光洒满室内；是全系列最动人的一件，也是馈赠的中心。",
 ["适配小茶蜡","镂空十字之光","装饰用 · 擦拭清洁"])
product(7,PUB+"/giftset.png","「宁静」礼盒","各样美善的恩赐","雅各书 1:17",
 "宁静马克杯与祝福碟，附赠一张祝福卡，同置于压印品牌纹样的珍藏礼盒中。一份完整而用心的礼物——为馈赠而生。",
 ["杯 + 碟 + 卡","珍藏礼盒","为馈赠而生"])

# ===================================================== 8 — CRAFT
page()
kickrule(M,86,"工艺与材质")
T(M,126,"刻入陶土的话语。",ZS_SB,32,UMBER)
img_cover(PUB+"/stamp.png", M,170, 252,236); img_cover(PUB+"/mug-base.png", M+266,170, 252,236)
T(M,424,"匠人印记——上为 CANA、下为 GALILEE——压入每件器物未上釉的底部。",ZH_R,9,MUT)
tx=M+266+252+34
para("经文皆刻入陶土，绝不印刷——同色同质，每件器物使用同一种字体；让阴影替你诵读，"
     "也让整个系列宛如出自同一双手。",tx,176,W-tx-M,"body")
pts=["温润的象牙／骨白色炻器——并非惨白","哑光至缎光釉面；底部素坯，触感质朴",
     "件件手工——绝无两件完全相同","简约恒久的造型——话语，即是唯一的装饰"]
for i,t in enumerate(pts):
    yb=300+i*34; T(tx,yb,"—",ZH_R,10,OLIVE); para(t,tx+16,yb-12,W-tx-M-16,"small")
footer(8)
c.showPage()

# ===================================================== 9 — PACKAGING
page()
kickrule(M,86,"包装与礼物")
T(M,126,"开箱的那一刻，就是礼物。",ZS_SB,32,UMBER)
pw=(W-2*M-2*20)/3
for i,im in enumerate([FP+"/mug/mug-box-closed.png",FP+"/giftset/giftset-box-open.png",FP+"/mug/mug-box-below-newpanel.png"]):
    x=M+i*(pw+20); img_cover(im,x,168,pw,244)
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-168-244,pw,244,fill=0,stroke=1)
para("骨白与亚麻色的硬质礼盒，盒盖压印橄榄枝，并以品牌印章封缄；内衬印有橄榄纹样的棉纸；"
     "每件器物皆附一张祝福卡——一面是经文，一面是它的含义。不晃动，不廉价。",M,440,W-2*M,"lead")
footer(9)
c.showPage()

# ===================================================== 10 — MADE TO SPEC (large drawings)
page()
kickrule(M,82,"制作规范")
T(M,120,"精确到毫米的图纸。",ZS_SB,31,UMBER)
para("每一件产品、每一个包装盒，皆按工厂标准绘制——标注尺寸的三视图、材质、公差、包装刀模，以及可直接付印的图稿。",M,146,W-2*M,"body")
cw=(W-2*M-26)/2; cy=190; ch=284
for i,(im,cap_) in enumerate([(FP+"/mug/mug-box-technical-drawing.png","马克杯盒——含盒底印刷图案"),
                              (FP+"/dish/dish-box-technical-drawing.png","碟盒——圆中有方")]):
    x=M+i*(cw+26); boxT(x,cy,cw,ch,CARD); c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-cy-ch,cw,ch,fill=0,stroke=1)
    img_fit(im,x+10,cy+10,cw-20,ch-20); T(x+cw/2,cy+ch+16,cap_,ZH_M,8.5,MUT,align="center",track=0.5)
footer(10)
c.showPage()

# ===================================================== 11 — MADE TO SPEC (spotlight)
page()
kickrule(M,82,"制作规范")
T(M,120,"连运输，也经过设计。",ZS_SB,31,UMBER)
para("一个实例——将礼盒重新构想为<b>节省空间的叠装</b>：碟平放于盒底，一层硬质刀模托架横跨其上，"
     "马克杯侧卧于凹槽之中，稳而不滚。",M,150,292,"lead")
para("图纸同时涵盖并排式与叠装式两种方案；每个盒底，都印有一面灵修图文。",M,266,292,"body")
bx_=372; bw=W-M-bx_; bh=326; cyt=150
boxT(bx_,cyt,bw,bh,CARD); c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(bx_,H-cyt-bh,bw,bh,fill=0,stroke=1)
img_fit(FP+"/giftset/giftset-box-technical-drawing-stacked.png", bx_+12,cyt+12,bw-24,bh-24)
footer(11)
c.showPage()

# ===================================================== 12 — PILLARS
page()
kickrule(M,92,"我们的坚持")
T(M,134,"四项坚持。",ZS_SB,37,UMBER)
pil=[("传家，而非商品","值得被珍藏、被传承的材质与工艺；绝无一次性的廉价感。"),
     ("清晰可辨的信仰","信仰清晰而坦然——以工艺与克制表达，绝不流于俗气。"),
     ("待客之道","为餐桌、为馈赠、为款待而作；是温雅的主人，而非广告牌。"),
     ("平凡中的神圣","我们尊荣日常的使用——清晨的杯、共享的餐——而非为装饰而装饰。")]
cwid=(W-2*M-3*30)/4
for i,(t,d) in enumerate(pil):
    x=M+i*(cwid+30); para(t,x,212,cwid,"ph"); rule(x,256,24,GOLD,1.2); para(d,x,272,cwid,"small")
footer(12)
c.showPage()

# ===================================================== 13 — CLOSING
page()
logo(W/2,156,114)
wordmark(W/2,250,cana=46,sub=16)
T(W/2,360,"为基督徒的家，制作可以传世的陶瓷。",ZH_R,12,ESP,align="center")
T(W/2,400,"cana-galilee.com      ·      valentinpueschel@gmail.com","WorkSans-Regular",11,UMBER,align="center")
T(W/2,452,"「我们有这宝贝放在瓦器里。」",ZS_R,15,UMBER,align="center")
T(W/2,472,"哥林多后书 4:7",ZH_M,8.5,OLIVE,align="center",track=1.5)
c.showPage()

c.save(); print("wrote", OUT)
