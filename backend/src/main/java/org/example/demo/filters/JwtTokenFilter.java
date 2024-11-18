package org.example.demo.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.entity.security.Account;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {


    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtil;

    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                // Remove the apiPrefix from these paths since request.getServletPath()
                // doesn't include the context path
                Pair.of("/roles.*", "GET"),
                Pair.of("/products.*", "GET"),
                Pair.of("/users/register", "POST"),
                Pair.of("/users/register", "POST"),
                Pair.of("/users/details/.*", "POST"),
                Pair.of("/users/refreshToken", "POST"),
                Pair.of("/users/login", "POST")
        );

        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();

        System.out.println("Checking path: " + requestPath + " with method: " + requestMethod);

        for (Pair<String, String> token : bypassTokens) {
            String path = token.getFirst();
            String method = token.getSecond();
            if (requestPath.matches(path) && requestMethod.equalsIgnoreCase(method)) {
                System.out.println("Matched bypass pattern: " + path);
                return true;
            }
        }
        return false;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain) throws ServletException, IOException {
        try {
            System.out.println("Request path: " + request.getServletPath());
            System.out.println("Request method: " + request.getMethod());


            if (isBypassToken(request)) {
                System.out.println("Bypassing token check for path: " + request.getServletPath());
                filterChain.doFilter(request, response);
                return;
            }
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "authHeader null or not started with Bearer");
                return;
            }
            final String token = authHeader.substring(7);
            final String email = jwtTokenUtil.getSubject(token);
            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                Account userDetails = (Account) userDetailsService.loadUserByUsername(email);
                System.out.println("Loaded user details for email: " + email);
                if (jwtTokenUtil.validateToken(token, userDetails)) {
                    System.out.println("Token is valid for user: " + userDetails.getUsername());
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//                    System.out.println("Authentication set in SecurityContext: " + SecurityContextHolder.getContext().getAuthentication());

                }
            }



            filterChain.doFilter(request, response); //enable bypass

            // ... rest of the method stays the same
        } catch (Exception e) {
            System.out.println("Filter error: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(e.getMessage());
        }
    }
}