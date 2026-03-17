import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 공개 페이지와 인증 페이지는 세션 체크 불필요 - 쿠키 갱신만 처리
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isPublicPage = request.nextUrl.pathname === "/";

  if (isAuthPage || isPublicPage) {
    // 세션 쿠키 갱신만 수행 (getSession은 로컬 쿠키만 읽어서 빠름)
    await supabase.auth.getSession();
    return supabaseResponse;
  }

  // 보호된 경로만 getUser() 호출 (Supabase API 요청)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
