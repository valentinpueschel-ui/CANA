#!/usr/bin/env python3
# Cana · Galilee — Brand & Collection deck. Authored with reportlab per the Brand Identity Guide.
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
OUT=SCR+"/Cana-Brand-Presentation-EN.pdf"

# ---- fonts (brand: Cormorant Garamond display, Work Sans body) -------------
for nm,fn in [("Cormorant-Regular","Cormorant-Regular"),("Cormorant-Medium","Cormorant-Medium"),
              ("Cormorant-SemiBold","Cormorant-SemiBold"),("Cormorant-Italic","Cormorant-Italic"),
              ("WorkSans-Regular","WorkSans-Regular"),("WorkSans-Medium","WorkSans-Medium"),
              ("WorkSans-SemiBold","WorkSans-SemiBold")]:
    pdfmetrics.registerFont(TTFont(nm, f"{FONTS}/{fn}.ttf"))
registerFontFamily("WorkSans-Regular", normal="WorkSans-Regular", bold="WorkSans-SemiBold", italic="WorkSans-Regular", boldItalic="WorkSans-SemiBold")
registerFontFamily("Cormorant-Regular", normal="Cormorant-Regular", bold="Cormorant-SemiBold", italic="Cormorant-Italic", boldItalic="Cormorant-SemiBold")

# ---- palette (exact, from guide 5.2) ---------------------------------------
BONE=HexColor("#F4EDDE"); LINEN=HexColor("#E7DAC4"); UMBER=HexColor("#54442F"); ESP=HexColor("#3A2E20")
OLIVE=HexColor("#7C7A53"); GOLD=HexColor("#B5934E"); MUT=HexColor("#8C7A60"); LINE=HexColor("#D8CCB4")
CARD=HexColor("#FBF7EF")
W,H=960,540; M=58
c=canvas.Canvas(OUT, pagesize=(W,H))

# ---- primitives ------------------------------------------------------------
def page(col=BONE): c.setFillColor(col); c.rect(0,0,W,H,fill=1,stroke=0)
def boxT(x,top,w,h,col): c.setFillColor(col); c.rect(x,H-top-h,w,h,fill=1,stroke=0)
def rule(x,top,w,col=OLIVE,wd=0.8): c.setStrokeColor(col); c.setLineWidth(wd); c.line(x,H-top,x+w,H-top)
def vrule(x,top,h,col=LINE,wd=0.8): c.setStrokeColor(col); c.setLineWidth(wd); c.line(x,H-top,x,H-top-h)
def T(x,base,s,font,size,col,align="left",track=0):
    c.setFont(font,size); c.setFillColor(col); yy=H-base
    if not track:
        if align=="center": c.drawCentredString(x,yy,s)
        elif align=="right": c.drawRightString(x,yy,s)
        else: c.drawString(x,yy,s)
        return
    tw=sum(c.stringWidth(ch,font,size)+track for ch in s)-track
    x0=x-tw/2 if align=="center" else (x-tw if align=="right" else x)
    for ch in s:
        c.drawString(x0,yy,ch); x0+=c.stringWidth(ch,font,size)+track

ST=dict(
 body=ParagraphStyle("body",fontName="WorkSans-Regular",fontSize=10.5,leading=16.5,textColor=ESP),
 lead=ParagraphStyle("lead",fontName="WorkSans-Regular",fontSize=11,leading=17.5,textColor=ESP),
 small=ParagraphStyle("small",fontName="WorkSans-Regular",fontSize=9,leading=14,textColor=ESP),
 cap=ParagraphStyle("cap",fontName="WorkSans-Regular",fontSize=8.5,leading=12.5,textColor=MUT),
 ph=ParagraphStyle("ph",fontName="Cormorant-SemiBold",fontSize=17,leading=19,textColor=UMBER),
)
def para(htmltext,x,top,w,style="body"):
    p=Paragraph(htmltext,ST[style]); pw,ph=p.wrap(w,2000); p.drawOn(c,x,H-top-ph); return ph

def kicker(x,base,s,col=OLIVE): T(x,base,s.upper(),"WorkSans-SemiBold",9.5,col,track=2.8)
def kickrule(x,base,s,col=OLIVE):
    rule(x,base-3.5,26,col,1); kicker(x+34,base,s,col)

def img_cover(path,x,top,w,h,q=88):
    im=Image.open(path).convert("RGB"); iw,ih=im.size; tar=w/h; cur=iw/ih
    if cur>tar: nw=int(round(ih*tar)); l=(iw-nw)//2; im=im.crop((l,0,l+nw,ih))
    else: nh=int(round(iw/tar)); t=(ih-nh)//2; im=im.crop((0,t,iw,t+nh))
    capw=int(max(900,w*2));
    if im.width>capw: im=im.resize((capw,int(capw*im.height/im.width)),Image.LANCZOS)
    f=f"{TMP}/cov_{abs(hash((path,w,h)))%10**8}.jpg"; im.save(f,"JPEG",quality=q)
    c.drawImage(f,x,H-top-h,w,h)
def img_fit(path,x,top,w,h,maxpx=1700):
    im=Image.open(path).convert("RGB")
    if im.width>maxpx: im=im.resize((maxpx,int(maxpx*im.height/im.width)),Image.LANCZOS)
    f=f"{TMP}/fit_{abs(hash((path,w,h)))%10**8}.jpg"; im.save(f,"JPEG",quality=90)
    c.drawImage(f,x,H-top-h,w,h,preserveAspectRatio=True,anchor="c")

# logo deboss composited on Bone (tighten alpha so the soft halo doesn't read as a box)
_lg=Image.open(SCR+"/olive_deboss_hq.png").convert("RGBA")
_r,_g,_b,_a=_lg.split(); _a=_a.point(lambda v: 0 if v<52 else min(255,int((v-52)*1.7)))
_lg.putalpha(_a)
_bg=Image.new("RGBA",_lg.size,(244,237,222,255)); _bg.alpha_composite(_lg)
_lg2=_bg.crop(_a.getbbox() or _bg.getbbox())
_lg2.convert("RGB").save(TMP+"/logo_bone.png","PNG"); _lr=_lg2.width/_lg2.height   # lossless = exact bone match
LOGO=TMP+"/logo_bone.png"
def logo(cx,top,w):
    h=w/_lr; c.drawImage(LOGO,cx-w/2,H-top-h,w,h); return h

def wordmark(cx,top,cana=52,sub=17,col=UMBER):
    T(cx,top+cana*0.74,"CANA","Cormorant-Medium",cana,col,align="center",track=cana*0.12)
    rule(cx-58,top+cana+14,116,OLIVE,0.9)
    T(cx,top+cana+34,"OF GALILEE","Cormorant-Regular",sub,col,align="center",track=sub*0.42)

def footer(n,x0=M):
    rule(x0,512,W-M-x0,LINE,0.7)
    T(x0,525,"CANA · GALILEE  —  BRAND & COLLECTION","WorkSans-Medium",7.5,MUT,track=1.6)
    T(W-M,525,f"{n:02d}","WorkSans-Medium",7.5,MUT)

def chips(x,top,items,col=OLIVE):
    cx=x
    for it in items:
        s=it.upper(); c.setFont("WorkSans-SemiBold",7)
        w=c.stringWidth(s,"WorkSans-SemiBold",7)+18
        c.setStrokeColor(col); c.setLineWidth(0.8); c.roundRect(cx,H-top-15,w,15,7.5,fill=0,stroke=1)
        c.setFillColor(UMBER); c.drawString(cx+9,H-top-10.5,s)
        cx+=w+7

# ============================================================ SLIDE 1 — COVER
page()
img_cover(PUB+"/luminary.png", 432,0, W-432, H)          # lit luminary = hero
logo(M+58,86,96)
kicker(M,196,"Brand & Collection · 2026")
wordmark(M+150,222,cana=58,sub=18)
T(M,360,"Heirloom ceramics for the Christian home.","WorkSans-Regular",11.5,ESP)
T(M,452,"“We have this treasure in jars of clay.”","Cormorant-Italic",17,UMBER)
T(M,470,"2 CORINTHIANS 4:7","WorkSans-Medium",8,OLIVE,track=2)
c.showPage()

# ============================================================ SLIDE 2 — BRAND
page()
img_cover(PUB+"/hands.png", 0,0, 452, H)
kickrule(512,150,"The Brand")
T(512,196,"Scripture you can hold.","Cormorant-SemiBold",37,UMBER)
para("Cana makes heirloom ceramics for the Christian home — warm ivory stoneware with a line of Scripture "
     "<b>pressed into the clay</b>, so the word is something you hold in your hands.",512,224,W-512-M,"lead")
para("Named for Cana of Galilee — the table, the welcome, the ordinary made sacred — every piece is made by "
     "hand to be kept and passed on. <b>We carve, we do not print. We bless, we do not preach.</b>",512,300,W-512-M,"lead")
footer(2,508)
c.showPage()

# ====================================================== SLIDE 3 — COLLECTION
page()
kickrule(M,86,"The Collection")
T(M,124,"Four pieces, one quiet language.","Cormorant-SemiBold",33,UMBER)
prods=[("The Be Still Mug","Be still, and know.","PSALM 46:10",PUB+"/mug.png"),
       ("The Blessing Dish","The Lord bless you and keep you.","NUMBERS 6:24",PUB+"/dish.png"),
       ("The Cana Light","The Lord is my light.","PSALM 27:1",PUB+"/luminary.png"),
       ("The “Be Still” Gift Set","Every good and perfect gift.","JAMES 1:17",PUB+"/giftset.png")]
gw=(W-2*M-3*22)/4
for i,(nm,vs,rf,im) in enumerate(prods):
    x=M+i*(gw+22)
    img_cover(im,x,150,gw,196)
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-150-196,gw,196,fill=0,stroke=1)
    T(x+gw/2,372,nm,"Cormorant-SemiBold",14.5,UMBER,align="center")
    T(x+gw/2,392,f"“{vs}”","Cormorant-Italic",11,ESP,align="center")
    T(x+gw/2,408,rf,"WorkSans-Medium",7.5,OLIVE,align="center",track=1.6)
footer(3)
c.showPage()

# ====================================================== SLIDES 4–7 — PRODUCTS
def product(n,img,nm,verse,ref,body,cs):
    page()
    img_cover(img,0,0,476,H)
    kicker(508,120,f"The Collection · 0{n-3}")
    T(508,162,nm,"Cormorant-SemiBold",30,UMBER)
    T(508,210,f"“{verse}”","Cormorant-Italic",23,UMBER)
    T(508,232,ref,"WorkSans-Medium",9,OLIVE,track=2)
    para(body,508,258,W-508-M,"lead")
    chips(508,338,cs)
    footer(n,508)
    c.showPage()
product(4,PUB+"/mug.png","The Be Still Mug","Be still, and know.","PSALM 46:10",
 "Warm ivory stoneware, 350 ml. The verse is pressed into the wall — read with the eye, felt under the thumb. "
 "A daily cup made to be kept.",["350 ml · 12 oz","Dishwasher & microwave safe","Carved verse"])
product(5,PUB+"/dish.png","The Blessing Dish","The Lord bless you and keep you.","NUMBERS 6:24",
 "A shallow Ø200 dish with the priestly blessing carved around the rim — kept in view on the table, by the door, "
 "beside the bed.",["Ø200 mm","Food-safe · dishwasher safe","Blessing on the rim"])
product(6,PUB+"/luminary.png","The Cana Light","The Lord is my light.","PSALM 27:1",
 "Our hero piece: a pierced stoneware luminary. Set a tea light inside and a soft cross of light falls across the "
 "room at dusk — the “wow” of the collection and the gift centrepiece.",["Fits a tea light","Pierced cross of light","Decorative · wipe clean"])
product(7,PUB+"/giftset.png","The “Be Still” Gift Set","Every good and perfect gift.","JAMES 1:17",
 "The Be Still Mug and the Blessing Dish with a blessing card, in a debossed keepsake box. A complete, considered "
 "gift — made to be given.",["Mug + dish + card","Keepsake gift box","Made to be given"])

# ======================================================= SLIDE 8 — THE CRAFT
page()
kickrule(M,86,"Craft & Materials")
T(M,124,"The carved word.","Cormorant-SemiBold",33,UMBER)
img_cover(PUB+"/stamp.png", M,170, 252,236)
img_cover(PUB+"/mug-base.png", M+266,170, 252,236)
T(M,424,"The maker’s coin — CANA over GALILEE — pressed into the unglazed base.","WorkSans-Regular",9,MUT)
tx=M+266+252+34
para("The verse is <b>carved into the clay, never printed</b> — tone-on-tone, the same letterform on every "
     "piece, so the shadow does the reading and the whole range looks of one hand.",tx,176,W-tx-M,"body")
pts=["Warm ivory / bone stoneware — not bright white","Matte-to-satin glaze; unglazed, tactile base",
     "Individually made — no two pieces alike","Timeless silhouettes — the word is the ornament"]
for i,t in enumerate(pts):
    yb=294+i*32; T(tx,yb,"—","WorkSans-Regular",10,OLIVE); para(t,tx+16,yb-11,W-tx-M-16,"small")
footer(8)
c.showPage()

# ==================================================== SLIDE 9 — PACKAGING
page()
kickrule(M,86,"Packaging & the Gift")
T(M,124,"The unboxing is the gift.","Cormorant-SemiBold",33,UMBER)
pw=(W-2*M-2*20)/3
for i,im in enumerate([FP+"/mug/mug-box-closed.png",FP+"/giftset/giftset-box-open.png",FP+"/mug/mug-box-below-newpanel.png"]):
    x=M+i*(pw+20); img_cover(im,x,162,pw,248)
    c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-162-248,pw,248,fill=0,stroke=1)
para("A sturdy rigid box in Bone and Linen, the <b>olive sprig debossed</b> on the lid and sealed with the coin "
     "mark; olive-print tissue inside; and a blessing card with every piece — the verse on one side, its meaning on "
     "the other. Nothing rattles, nothing feels cheap.",M,436,W-2*M,"lead")
footer(9)
c.showPage()

# ============================== SLIDES 10–11 — MADE TO SPEC (drawings LARGE)
page()
kickrule(M,82,"Made to Spec")
T(M,118,"Documented to the millimetre.","Cormorant-SemiBold",31,UMBER)
para("Every product and every box is drawn to factory standard — dimensioned third-angle views, materials, "
     "clearances, packaging die-lines and print-ready artwork.",M,142,W-2*M,"body")
cw=(W-2*M-26)/2; cy=188; ch=286
for i,(im,capn) in enumerate([(FP+"/mug/mug-box-technical-drawing.png","Mug box — with printed base panel"),
                              (FP+"/dish/dish-box-technical-drawing.png","Dish box — circle-in-square")]):
    x=M+i*(cw+26); boxT(x,cy,cw,ch,CARD); c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(x,H-cy-ch,cw,ch,fill=0,stroke=1)
    img_fit(im,x+10,cy+10,cw-20,ch-20)
    T(x+cw/2,cy+ch+16,capn,"WorkSans-Medium",8.5,MUT,align="center",track=0.6)
footer(10)
c.showPage()

page()
kickrule(M,82,"Made to Spec")
T(M,118,"Designed to ship beautifully.","Cormorant-SemiBold",31,UMBER)
para("A worked example — the gift set re-imagined as a <b>space-saving stack</b>: the dish flat on the floor, a "
     "rigid die-cut cradle bridging it, and the mug lying on its side in a saddle so nothing rolls.",M,150,290,"lead")
para("The pack covers both the side-by-side and the stacked layouts, with a printed devotional panel on every "
     "box underside.",M,262,290,"body")
bx_=372; bw=W-M-bx_; bh=326; cyt=150
boxT(bx_,cyt,bw,bh,CARD); c.setStrokeColor(LINE); c.setLineWidth(0.8); c.rect(bx_,H-cyt-bh,bw,bh,fill=0,stroke=1)
img_fit(FP+"/giftset/giftset-box-technical-drawing-stacked.png", bx_+12,cyt+12,bw-24,bh-24)
footer(11)
c.showPage()

# ===================================================== SLIDE 12 — PILLARS
page()
kickrule(M,92,"What We Hold To")
T(M,132,"Four pillars.","Cormorant-SemiBold",37,UMBER)
pil=[("Heirloom, not merch","Materials and finishes that justify being kept and handed down. No throwaway feel."),
     ("Legibly Christian","Faith clear and spoken — expressed with craft and restraint, never kitsch."),
     ("Hospitality","Built for the table, the gift, the welcome. A gracious host, not a billboard."),
     ("The ordinary made sacred","We dignify daily use — the morning cup, the shared meal — not decoration for its own sake.")]
cwid=(W-2*M-3*30)/4
for i,(t,d) in enumerate(pil):
    x=M+i*(cwid+30)
    para(t,x,212,cwid,"ph"); rule(x,258,24,GOLD,1.2); para(d,x,274,cwid,"small")
footer(12)
c.showPage()

# ===================================================== SLIDE 13 — CLOSING
page()
logo(W/2,156,114)
wordmark(W/2,250,cana=46,sub=15)
T(W/2,360,"Heirloom ceramics for the Christian home.","WorkSans-Regular",11.5,ESP,align="center")
T(W/2,400,"cana-galilee.com      ·      valentinpueschel@gmail.com","WorkSans-Regular",11,UMBER,align="center")
T(W/2,454,"“We have this treasure in jars of clay.”","Cormorant-Italic",16,UMBER,align="center")
T(W/2,473,"2 CORINTHIANS 4:7","WorkSans-Medium",8,OLIVE,align="center",track=2)
c.showPage()

c.save()
print("wrote", OUT)
