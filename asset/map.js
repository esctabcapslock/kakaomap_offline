const floor = Math.floor // 반올림

class Map_view{
    constructor (x,y,z){
        this.dom={}
        this.flag={
            'move': false,
            'scrol': false,
            'scrol_start': null,
            'scrol_sum': null,
            'scrol_sum_cnt': null,
            'move_start_x':null,
            'move_start_y':null,
        }
        this.mapimg={
            'L':6,
            'origin_x':123,
            'origin_y':193,
            'col_x':0,
            'col_y':0,
            'col_mov_x':0,
            'col_mov_y':0,
            'img_list':[],
            'mapimg_reset':()=>{
                //this.mapimg.origin_x = Math.floor(this.mapimg.origin_x / (L/this.mapimg.L));
                //this.mapimg.origin_y = Math.floor(this.mapimg.origin_y / (L/this.mapimg.L));
                //this.mapimg.L = L
                this.mapimg.img_list = []
                this.dom.map_in.innerHTML='';
                //console.log(this)
            },
            'move':(x,y)=>{
                if(!this.flag.move) return; //움직이지 않는다면.
                this.mapimg.col_mov_x = this.mapimg.col_x + (x-this.flag.move_start_x);
                this.mapimg.col_mov_y =this.mapimg.col_y + (y-this.flag.move_start_y);

                this.dom.map_in.style.left = `${this.mapimg.col_mov_x}px`
                this.dom.map_in.style.top = `${this.mapimg.col_mov_y}px`
            },
            'move_col':(x,y)=>{
                if(this.flag.move) this.manage.mouseend()

                this.mapimg.col_mov_x = this.mapimg.col_x += x;
                this.mapimg.col_mov_y =this.mapimg.col_y += y;

                this.dom.map_in.style.left = `${this.mapimg.col_mov_x}px`
                this.dom.map_in.style.top = `${this.mapimg.col_mov_y}px`
            },
            'scroll':(v,x,y)=>{
                if (this.mapimg.L+v<=0) return;
                if (this.mapimg.L+v>=15) return;

                //console.log('scrool fn',v,x,y, this.mapimg.L)
                //this.mouseend(); // 확실하게 종료시키기.
                let 배율 = v==1?0.5:2;
                let a=Math.round(Math.random()*100)
                //console.log('이전',a,this.mapimg.col_x)
                this.mapimg.col_mov_x = this.mapimg.col_x = (this.mapimg.col_x-x)*배율+x
                this.mapimg.col_mov_y = this.mapimg.col_y = (this.mapimg.col_y-y)*배율+y
                //console.log('이후',a,this.mapimg.col_x,   )

                this.mapimg.origin_x *= 배율
                if(v==-1) this.mapimg.origin_y = this.mapimg.origin_y*2+1
                else this.mapimg.origin_y = (this.mapimg.origin_y - 1)/2
                this.dom.map_in.style.left = `${this.mapimg.col_x}px`
                this.dom.map_in.style.top = `${this.mapimg.col_y}px`
                this.mapimg.L += v
                this.mapimg.mapimg_reset()

                this.mapimg.change()
            },
            'moveend':()=>{
                this.mapimg.col_x = this.mapimg.col_mov_x
                this.mapimg.col_y = this.mapimg.col_mov_y
            },
            'change':()=>{
                //return;
                var tthis = this.mapimg
                let pixel = 256;


                var off_x = floor(this.mapimg.origin_x) - floor(this.mapimg.col_x/pixel);
                var off_y = floor(this.mapimg.origin_y) + floor(this.mapimg.col_y/pixel);

                var x_count = floor(screen.width/pixel)
                var y_count = floor(screen.height/pixel)

                console.log(off_x, off_y)

                for (var x = off_x - 1; x <= (off_x + x_count); x++)
                    for (var y = off_y - y_count; y <= (off_y + 2); y++){
                        //console.log(x,y)
                        var img_col_x = (x-this.mapimg.origin_x)*pixel
                        var img_col_y = (this.mapimg.origin_y-y)*pixel
                        var img_col = this.mapimg.L+'|'+x+'|'+y;
                        if (this.mapimg.img_list.includes(img_col)) continue;
                        this.mapimg.img_list.push(img_col);
                        //console.log('32')
                        this.dom.map_in.innerHTML+=`<img style="left: ${img_col_x}px; top: ${img_col_y}px;" src='./img/map/${this.mapimg.L}/${y}/${x}'>`
                    }
                
               
            }
        }
        this.dom['map_out'] = document.getElementById('map_out');
        this.dom['map'] = document.getElementById('map');
        this.dom['map_in'] = document.getElementById('map_in');
        this.dom['body'] = document.body

        this.dom['map_out'].manage = this
        this.dom['map'].manage = this
        this.dom['map_in'].manage = this
        this.dom['body'].manage = this
        

        this.dom.map_out.addEventListener('mousedown', this.mousedown)
        this.dom.map_out.addEventListener('mousemove', this.mousemove)
        this.dom.map_out.addEventListener('mouseup', this.mouseleave)
        this.dom.map_out.addEventListener('mouseleave', this.mouseleave)
        this.dom.map_out.addEventListener('wheel', this.scroll)
        this.dom.body.addEventListener('wheel',()=>{}) // 알수없는이유 edge에서 생긴 문제.  
        this.dom.body.addEventListener('keydown', this.keydown)
        
        this.mapimg.change()

    }
    keydown(e){
        let pixel = 256
        let tthis = this.manage;
        console.log(e.key, this, tthis)
        if (e.key=='ArrowDown') this.manage.mapimg.move_col(0,-pixel/2)
        else if (e.key=='ArrowUp') this.manage.mapimg.move_col(0,+pixel/2)
        else if (e.key=='ArrowLeft') this.manage.mapimg.move_col(pixel/2,0)
        else if (e.key=='ArrowRight') this.manage.mapimg.move_col(-pixel/2,0)
        else return;
        this.manage.mapimg.change()

    }

    mousedown (e){
        //console.log(this,e) // this는 #map_out임.
        //console.log(this.manage)
        this.manage.flag.move = true;
        let x = e.pageX, y = e.pageY;
        this.manage.flag.move_start_x = x;
        this.manage.flag.move_start_y = y;
        
        //console.log('[mousedown]',x,y);
    }
    mousemove (e){
        //return;
        if(! this.manage.flag.move) return;
        let x = e.pageX, y = e.pageY;
        this.manage.mapimg.move(x,y);
        
        //console.log('[mousemove]',x,y);
    }
    mouseleave(e){
        //console.log('end',this)
        this.manage.mouseend()
        this.manage.mapimg.change()
        //console.log('[mouseleave]');
    }
    mouseend (){
        //console.log('end',this)
        this.flag.move = false;
        this.flag.move_start_x = null;
        this.flag.move_start_y = null;
        this.mapimg.moveend();
        //console.log('[mouseend]');
    }
    scroll(e){
        let date = new Date()
        //console.log('스ㅡ롤',e.deltaY)
        if(!this.manage.flag.scrol_start){ // 시작할 때,,
            this.manage.flag.scrol = true;
            this.manage.flag.scrol_sum = 0;
            this.manage.flag.scrol_sum_cnt = 0;
            this.manage.flag.scrol_start = new Date();

            // 움직이고 있다면 멈춰라!
            this.manage.flag.move = false;
            this.manage.flag.move_start_x = null;
            this.manage.flag.move_start_y = null;
            this.manage.mapimg.moveend();
        }
        else if (date - this.manage.flag.scrol_start <= 100){ // 이벤트 간격이 0.1초 이하... 진행중이라는 소리.
            this.manage.flag.scrol_start = date
            this.manage.flag.scrol_sum+=e.deltaY

            let new_cnt = Math.floor(this.manage.flag.scrol_sum/30)
            if (this.manage.flag.scrol_sum_cnt < new_cnt){
                //console.log('양으로, 바꿀 것이다.!!')
                this.manage.mapimg.scroll(1, e.pageX, e.pageY)
            }else if (this.manage.flag.scrol_sum_cnt > new_cnt){
                //console.log('음으로, 바꿀 것이다.!!')
                this.manage.mapimg.scroll(-1, e.pageX, e.pageY)
            }
            this.manage.flag.scrol_sum_cnt = new_cnt
        }else{ // 스크롤 끝남.
            //console.log('종료',e.deltaY, this.manage.flag.scrol_sum)
            this.manage.flag.scrol_start = null;
            this.manage.flag.scrol_sum = 0
            
        }
       
        
        //setTimeout(()=>{this.manage.flag.scrol = false;},00) // "스로틀 기법"이라는 이름으로 유명한 것임.
        
    }
}